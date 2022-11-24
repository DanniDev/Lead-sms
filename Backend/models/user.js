import mongoose from 'mongoose';

let Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	userId: String,
	referralCode: {
		type: String,
		trim: true,
	},
	shareUrl: String,
	totalReferrals: {
		type: Number,
		default: 0,
	},
	referralSource: String,
	refereCode: {
		type: String,
		default: '',
		trim: true,
	},
	status: String,
});

export default mongoose.model('User', userSchema);
