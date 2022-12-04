import express, { json } from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import voucher_codes from "voucher-code-generator";
import path from 'path';
import async from 'async';
import jwt from 'jsonwebtoken';
import mailchimp from '@mailchimp/mailchimp_marketing';
import md5 from 'md5';
import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

const app = express();

//Models & DBs
import User from './models/user.js';
import connectDB from './config/db.js';

//Configs
mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_KEY,
	server: 'us12',
});

const listId = process.env.LIST_ID;

// INTITIALIZE APP ENVIROMENT VARIABLES
dotenv.config();

// Connect to mongodb atlas
connectDB();

//Initial variables
let today = new Date();
let seconds = today.getSeconds();

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RECEIVE MAILCHIMP WEBHOOK POST REQUEST
//HANDLE DATA SEND BY MAILCHIPM DUE TO CHANGES OR UPDATES IN YOUR LIST

app.post('/', async(req, res, next) => {
	const { type, data } = req.body;
	
	
	if (type !== "subscribe") { 
	   console.log('IM FAKE HOOK REQUEST ==>');
		return res.end();
	}

	console.log('IM MAILCHIMP WEBHOOK REQUEST ==>');
	//CHECK TO SEE IF COMPLETELY NEW SUBSCRIBER
	if (
		data.merges.REFCODE.length < 1  &&
		data.merges.REFERECODE.length < 1 
	) {
		try{
		console.log('IM NEW SUBSCRIBER ==>');
		const generatedCode = voucher_codes.generate({
			length: 8,
			count: 1,
		});

		let referralCode = generatedCode[0] + seconds;

		const token = jwt.sign(
			{
				user: data.email,
			},
			'secretKey'
		);

		const newUser = new User({
			email: data.email,
			referralCode: referralCode,
			shareUrl: process.env.SHARE_URL + '=' + referralCode,
			referralSource: token,
			totalReferrals: 0,
			status: 'subscribed',
		});

			console.log("Im in try code!");
		    	console.log('USER INFO ==>', newUser);
			
			const savedUser = await newUser.save();
			const subscriber_hash = md5(savedUser.email.toLowerCase());

			const response = await mailchimp.lists.updateListMember(
				listId,
				subscriber_hash,
				{
					merge_fields: {
						REFCOUNT: 0,
						SHAREURL: savedUser.shareUrl,
						REFCODE: savedUser.referralCode,
						REFSOURCE: savedUser.referralSource,
					},
				}
			);
			console.log('Successfully saved new user to DB!');
			return console.log('Successfully updated user field in Mailchimp!');
			} catch(error){
				console.log('error in try catch', error);
				return console.log(error.message);
			}
		
	} else if (data.merges.REFERECODE.length > 1 && data.merges.REFCODE.length > 1) {
		//WAS REFERED BY SOMEONE
		console.log("I'M REFFERED BY FRIEND ==>");
		const user = new User({
			userId: data.id,
			email: data.email,
			referralCode: data.merges.REFCODE,
			shareUrl: data.merges.SHAREURL,
			referralSource: data.merges.REFSOURCE,
			totalReferrals: data.merges.REFCOUNT,
			refereCode: data.merges.REFERECODE,
			status: 'subscribed',
		});

		//FIND REFEREE AND INCREMENT THEIR TOTALREFERRALS
		async function run() {
			const refereeUser = await User.findOne({
				referralCode: data.merges.REFERECODE,
			});

			if (refereeUser) {
				refereeUser.totalReferrals = refereeUser.totalReferrals += 1;

				try {
					//  UPDATE REFEREE IN DB
					await user.save();
					const updatedUser = await refereeUser.save();

					//  UPDATE REFEREE IN MAILCHIMP
					const addToRefcount = updatedUser.totalReferrals;
					const email = updatedUser.email;
					const subscriberHash = md5(email.toLowerCase());

					const response = await mailchimp.lists.updateListMember(
						listId,
						subscriberHash,
						{
							merge_fields: {
								REFCOUNT: addToRefcount,
							},
						}
					);
				} catch (error) {
					console.log(error.message);
					return next(error);
				}
			}
		}

		run();
	}
});

// PRODUCTION MODE SETUP
	app.get('/', (req, res) =>
		res.send(
			'<h1 style="padding: 20px; text-align: center">Close CRM API is running on development mode...</h1>'
		)
	);


//SET DEFAULT PORT IF IN DEVELOPMENT MODE
const port = process.env.PORT || 5000;

app.listen(
	port,
	console.log(
		`Server running on ${port} in ${process.env.NODE_ENV} mode`
	)
);
