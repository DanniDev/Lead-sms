import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

//Reducers
import { adminLoginReducer } from './reducers/adminReducers';
import {
	hookSubscribeReducer,
	hookUnsubscribeReducer,
	hookApiReducer,
} from './reducers/hookReducers';
const reducer = combineReducers({
	adminLogin: adminLoginReducer,
	hookSubscribe: hookSubscribeReducer,
	hookUnsubscribe: hookUnsubscribeReducer,
	hookApi: hookApiReducer,
});

const adminInfoFromStorage = localStorage.getItem('adminInfo')
	? JSON.parse(localStorage.getItem('adminInfo'))
	: {};
const hookDetailsFromStorage = localStorage.getItem('hookDetails')
	? JSON.parse(localStorage.getItem('hookDetails'))
	: { id: '' };

const initialState = {
	adminLogin: {
		adminInfo: adminInfoFromStorage,
	},
	hookSubscribe: {
		hookDetails: hookDetailsFromStorage,
	},
};

const middleware = [thunk];

const store = legacy_createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
