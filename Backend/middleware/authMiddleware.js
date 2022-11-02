import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const protect = asyncHandler(async (req, res, next) => {
	let token;
	let admin = {
		email: 'admin@server.com',
		password: 'admin',
	};

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];

		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);

			// req.user = await User.findById(decoded.id).select('-password');
			req.admin = true;
			req.user = decoded.id;

			next();
		} catch (error) {
			if (error.message === 'jwt expired') {
				req.admin = false;
				req.user = null;

				console.log(error.message);
				next();
			}
		}
	}

	if (!token) {
		req.admin = false;

		req.user = null;

		console.log('No token provided');
		throw new Error('No token provided');
		// res.send(400, 'No token provided');
		res.json({ error: 'not authorized' });
		next();
	}
});

export default protect;
