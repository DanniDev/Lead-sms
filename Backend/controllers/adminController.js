import asyncHandler from 'express-async-handler';
import genToken from '../genToken.js';

// post "/api/login"
// POST ADMIN LOGIN ROUTE
const authAdmin = asyncHandler(async (req, res) => {
	const admin = {
		email: 'admin@server.com',
		password: 'admin',
	};

	const { password, email } = req.body;

	console.log(req.body);

	if (email === admin.email && password === admin.password) {
		return res.status(200).json({
			email: 'admin@server.com',
			name: 'Jean Alen',
			isAdmin: true,
			token: genToken(email),
		});
	} else {
		throw new Error('Invalid username or password');
	}
});

// get "/api/admin"
// GET ADMIN ROUTE
const getAdmin = asyncHandler(async (req, res) => {
	const adminEmail = 'admin@server.com';

	if (req.admin && req.user === adminEmail) {
		return res
			.status(200)
			.json({ email: 'admin@server.com', name: 'Jean Alen', isAdmin: true });
	} else {
		res.status(400).json({ message: 'Unthorized user' });
	}
});

export { authAdmin, getAdmin };
