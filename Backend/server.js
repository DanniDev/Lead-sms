import express, { json } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import path from 'path';
import nodemailer from 'nodemailer';
import errorHandler from './middleware/errorMiddleware.js';
import protect from './middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';

// Routes
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INTITIALIZE APP ENVIROMENT VARIABLES
dotenv.config();

// RECEIVED CLOSE CRM POST WEBHOOK REQUEST
//CLOSE WEBHOOK POST ENDPOINT
app.post(
	'/hook',
	asyncHandler(async (req, res) => {
		console.log('WEBHOOK POST REQUEST ===>');
		// GET THE DATA OR THE INFO OF THE SMS FROM THE CLOSE CRM WEBHOOK
		const { event } = req.body;
		const { local_phone_formatted, contact_id, lead_id, text } = event.data;

		// CHECK IF IT CAME FROM EXISTING LEAD
		if (lead_id) {
			if (event.data.direction === 'inbound') {
				// FETCH THE LEAD THE SMS CAME FROM
				const response = await axios.get(
					`https://api.close.com/api/v1/lead/${lead_id}`,
					{
						headers: {
							Accept: 'application/json',
						},
						auth: {
							username: process.env.API_KEY,
						},
					}
				);

				// GET THE DATA FROM THE LEAD FETCH RESPONSE
				const { data: result } = response;

				// GET THE LEAD NAME AND CONTACTS OF THE LEAD
				const { contacts } = result;

				// LOOP THROUGH THE CONTACTS FOR THE LEAD CONTACT OR SENDER
				const contact = await contacts.find(
					(contact) => contact.id === contact_id
				);
				// console.log('WEBHOOK EVENT ===>', event.data);
				// console.log('SMS EVENT TYPE ===>', event.data.direction);

				// FORWARD LEAD TEXT TO CLIENT AS SMS
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				const { data } = await axios.get(
					`https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.SMS_KEY}&to=17702035144&from=LEAD&sms=LEAD NAME : ${result.name}\nCONTACT : ${contact.name}\nPHONE : ${contact.phones[0].phone}\nMESSAGE : ${text}`,
					config
				);

				console.log('LEAD ARKESEL SMS => ', data);

				// MAILING SMTP CONFIGUATION
				const transporter = nodemailer.createTransport({
					host: 'server233.web-hosting.com',
					port: 465,
					secure: true, // true for 465, false for other ports
					auth: {
						user: 'info@merkadobarkada.com', // your domain email address
						pass: process.env.USER_PASS, // your password
					},
				});

				// MAIL SENDER OPTIONS
				const mailOptions = {
					from: '"Zap-Alike Server" <info@merkadobarkada.com>', // sender address (who sends)
					to: ['dr4lyf@gmail.com', 'aandrfamilyhousing@gmail.com'], // list of receivers (who receives)
					subject: `New Sms from ${result.name}`, // Subject line
					text: `LEAD NAME : ${result.name}\nCONTACT : ${contact.name}\nPHONE : ${contact.phones[0].phone}\nMESSAGE : ${text}`, // plaintext body
					// html: template,
				};

				// SEND THE MAIL
				transporter.sendMail(mailOptions, (error, response) => {
					error ? console.log(error) : console.log(response);
					transporter.close();
				});

				return res.end();
			} else {
				return res.end();
			}
		} else {
			if (event.data.direction === 'inbound') {
				// FORWARD LEAD TEXT TO CLIENT AS SMS
				const config = {
					headers: {
						'Content-Type': 'application/json',
					},
				};

				const { data } = await axios.get(
					`https://sms.arkesel.com/sms/api?action=send-sms&api_key=${process.env.SMS_KEY}&to=17702035144&from=LEAD&sms=LEAD NAME : Not Assigned\nCONTACT : Not Set\nPHONE : ${event.data.remote_phone}\nMESSAGE : ${text}`,
					config
				);

				console.log('UNLEAD ARKESEL SMS => ', data);

				// console.log('WEBHOOK EVENT ===>', event);
				// console.log('SMS EVENT TYPE ===>', event.data.direction);
				// MAILING SMTP CONFIGUATION
				const transporter = nodemailer.createTransport({
					host: 'server233.web-hosting.com',
					port: 465,
					secure: true, // true for 465, false for other ports
					auth: {
						user: 'info@merkadobarkada.com', // your domain email address
						pass: process.env.USER_PASS, // your password
					},
				});

				// MAIL SENDER OPTIONS
				const mailOptions = {
					from: '"Zap-Alike Server" <info@merkadobarkada.com>', // sender address (who sends)
					to: ['dr4lyf@gmail.com', 'aandrfamilyhousing@gmail.com'], // list of receivers (who receives)
					subject: `New Sms from not assigned lead`, // Subject line
					text: `LEAD NAME : Not Assigned\nCONTACT : Not Set\nPHONE : ${event.data.remote_phone}\nMESSAGE : ${text}`, // plaintext body
					// html: template,
				};

				// SEND THE MAIL
				transporter.sendMail(mailOptions, (error, response) => {
					error ? console.log(error) : console.log(response);
					transporter.close();
				});

				return res.end();
			} else {
				return res.end();
			}
		}
	})
);

// DELETE AXIOS WEBHOOK
app.delete('/api/unsubscribe/:id', protect, async (req, res) => {
	const { id } = req.params;

	const response = await axios(`https://api.close.com/api/v1/webhook/${id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {
			username: process.env.API_KEY,
		},
	});
	const { data } = response;
	console.log('hello Im unsubscribeHook');
	res.json(data);
});

// SUBSCRIBE CLOSE CRM WEBHOOK
app.post('/api/subscribe', protect, async (req, res) => {
	const response = await axios('https://api.close.com/api/v1/webhook/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {
			username: process.env.API_KEY,
		},
		data: {
			url: 'https://leadsmsapp.herokuapp.com/hook',
			events: [
				{
					object_type: 'activity.sms',
					action: 'created',
				},
			],
		},
	});

	const { data } = response;
	console.log('hello Im subscribe');
	res.json({ id: data.id });
});

//MIDDLEWARES
app.use('/api/admin', adminRoutes);
app.use('/api/', eventRoutes);

app.use(errorHandler);

// INTIALIZE MORGAN TO LOG EACH ROUTE ON THE CONSOLE
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// PRODUCTION MODE SETUP
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));

	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	);
} else {
	app.get('/', (req, res) =>
		res.send(
			'<h1 style="padding: 20px; text-align: center">Close CRM API is running on development mode...</h1>'
		)
	);
}

//SET DEFAULT PORT IF IN DEVELOPMENT MODE
const port = process.env.PORT || 5000;

app.listen(
	port,
	console.log(
		`Server running on ${port} in ${process.env.NODE_ENV} mode`.yellow
	)
);
