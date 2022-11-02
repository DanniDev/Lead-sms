import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

//Reducers
import { adminLoginReducer } from './reducers/adminReducers';
import {
	hookSubscribeReducer,
	hookUnsubscribeReducer,
	hookDetailsReducer,
} from './reducers/hookReducers';
const reducer = combineReducers({
	adminLogin: adminLoginReducer,
	hookSubscribe: hookSubscribeReducer,
	hookUnsubscribe: hookUnsubscribeReducer,
	hookDetails: hookDetailsReducer,
});

const adminInfoFromStorage = localStorage.getItem('adminInfo')
	? JSON.parse(localStorage.getItem('adminInfo'))
	: {};
const hookInfoFromStorage = localStorage.getItem('hookInfo')
	? JSON.parse(localStorage.getItem('hookInfo'))
	: { id: '' };

const initialState = {
	adminLogin: {
		adminInfo: adminInfoFromStorage,
	},
	hookSubscribe: {
		hookInfo: hookInfoFromStorage,
	},
};

const middleware = [thunk];

const store = legacy_createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
