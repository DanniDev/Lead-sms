import asyncHandler from 'express-async-handler';

// get "/api_key"
// CLOSE CRM WEBHOOK SUBSCRIPTION ENDPOINT
const getApiKey = asyncHandler(async (req, res) => {
	return res.status(200).json({ api_key: process.env.API_KEY });
});

// DELETE WEBHOOK
const subscribeHook = asyncHandler(async (req, res) => {
	const response = await axios('https://api.close.com/api/v1/webhook/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {
			username: process.env.API_KEY,
		},
		data: {
			url: 'https://closecrm-api.herokuapp.com/hook',
			events: [
				{
					object_type: 'activity.sms',
					action: 'created',
				},
			],
		},
	});

	const { data } = response;
	console.log('hello Im unsubscribeHook');
	res.json(data);
});

export { subscribeHook, getApiKey };
