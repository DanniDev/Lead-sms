import {
	HOOK_SUBSCRIBE_REQUEST,
	HOOK_SUBSCRIBE_SUCCESS,
	HOOK_SUBSCRIBE_FAIL,
	HOOK_SUBSCRIBE_RESET,
	HOOK_UNSUBSCRIBE_REQUEST,
	HOOK_UNSUBSCRIBE_SUCCESS,
	HOOK_UNSUBSCRIBE_FAIL,
	HOOK_API_KEY_REQUEST,
	HOOK_API_KEY_SUCCESS,
	HOOK_API_KEY_FAIL,
} from '../constants/hookConstants';

export const hookSubscribeReducer = (
	state = { hookDetails: { id: '' } },
	action
) => {
	switch (action.type) {
		case HOOK_SUBSCRIBE_REQUEST:
			return {
				...state,
				loading: true,
			};

		case HOOK_SUBSCRIBE_SUCCESS:
			return {
				loading: false,
				hookDetails: action.payload,
			};

		case HOOK_SUBSCRIBE_FAIL:
			return {
				loading: false,
				error: action.payload,
			};

		case HOOK_SUBSCRIBE_RESET:
			return {
				loading: false,
				hookDetails: { id: '' },
			};

		default:
			return state;
			break;
	}
};

export const hookUnsubscribeReducer = (state = { succes: false }, action) => {
	switch (action.type) {
		case HOOK_UNSUBSCRIBE_REQUEST:
			return {
				loading: true,
			};

		case HOOK_UNSUBSCRIBE_SUCCESS:
			return {
				loading: false,
				success: true,
			};

		case HOOK_UNSUBSCRIBE_FAIL:
			return {
				loading: false,
				error: action.payload,
			};

		default:
			return state;
			break;
	}
};

export const hookApiReducer = (state = {}, action) => {
	switch (action.type) {
		case HOOK_API_KEY_REQUEST:
			return {
				loading: true,
			};

		case HOOK_API_KEY_SUCCESS:
			return {
				loading: false,
				hookApi: action.payload,
			};

		case HOOK_API_KEY_FAIL:
			return {
				loading: false,
				error: action.payload,
			};

		default:
			return state;
			break;
	}
};
