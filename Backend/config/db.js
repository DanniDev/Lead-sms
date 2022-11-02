import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('CRM-DB is connected!'.cyan.underline.bold);
	} catch (err) {
		console.log(err.message);
	}
};

export default connectDB;
