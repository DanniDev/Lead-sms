import axios from 'axios';

import {
	HOOK_SUBSCRIBE_REQUEST,
	HOOK_SUBSCRIBE_SUCCESS,
	HOOK_SUBSCRIBE_FAIL,
	HOOK_UNSUBSCRIBE_REQUEST,
	HOOK_UNSUBSCRIBE_SUCCESS,
	HOOK_UNSUBSCRIBE_FAIL,
	HOOK_API_KEY_REQUEST,
	HOOK_API_KEY_SUCCESS,
	HOOK_API_KEY_FAIL,
	HOOK_SUBSCRIBE_RESET,
} from '../constants/hookConstants';

export const subscribeHook = (apiKey) => async (dispatch, getState) => {
	try {
		dispatch({ type: HOOK_SUBSCRIBE_REQUEST });
		const {
			adminLogin: { adminInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		const { data } = await axios.post('/api/subscribe', {}, config);

		localStorage.setItem('hookDetails', JSON.stringify({ id: data.id }));

		console.log(data);

		dispatch({
			type: HOOK_SUBSCRIBE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: HOOK_SUBSCRIBE_FAIL,
			payload: error.message,
		});
	}
};

export const unSubscribeHook = (id) => async (dispatch, getState) => {
	try {
		const {
			adminLogin: { adminInfo },
		} = getState();

		dispatch({ type: HOOK_UNSUBSCRIBE_REQUEST });

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};

		const { data } = await axios.delete(`/api/unsubscribe/${id}`, config);

		localStorage.removeItem('hookDetails');

		dispatch({
			type: HOOK_UNSUBSCRIBE_SUCCESS,
		});
		dispatch({
			type: HOOK_SUBSCRIBE_RESET,
		});
	} catch (error) {
		dispatch({
			type: HOOK_UNSUBSCRIBE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getApiKey = (key) => async (dispatch, getState) => {
	try {
		dispatch({ type: HOOK_API_KEY_REQUEST });
		const {
			adminLogin: { adminInfo },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${adminInfo.token}`,
			},
		};
		const { data } = await axios.post(`/api/${key}`, {}, config);

		dispatch({
			type: HOOK_API_KEY_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: HOOK_API_KEY_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
