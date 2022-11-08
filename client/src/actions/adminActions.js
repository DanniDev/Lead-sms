import axios from 'axios';
import {
	ADMIN_LOGIN_FAIL,
	ADMIN_LOGOUT,
	ADMIN_LOGIN_REQUEST,
	ADMIN_LOGIN_SUCCESS,
} from '../constants/adminConstants';

export const loginAdmin = (info) => async (dispatch) => {
	try {
		dispatch({
			type: ADMIN_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post('/api/admin/login', info, config);

		localStorage.setItem('adminInfo', JSON.stringify(data));

		localStorage.removeItem('hookInfo');

		dispatch({
			type: ADMIN_LOGIN_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: ADMIN_LOGIN_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const logoutAdmin = () => async (dispatch) => {
	localStorage.removeItem('adminInfo');
	dispatch({ type: ADMIN_LOGOUT });
};
