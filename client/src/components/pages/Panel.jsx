import clsx from 'clsx';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	subscribeHook,
	unSubscribeHook,
	getApiKey,
} from '../../actions/hookActions';
import { useNavigate } from 'react-router-dom';

import Spinner from '../layout/Spinner';

export default function Panel() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { loading, hookDetails } = useSelector((state) => state.hookSubscribe);
	const { loading: loadingHookApi, hookApi } = useSelector(
		(state) => state.hookApi
	);
	const {
		loading: loadingUnsubscribe,
		error: errorUnsubscribe,
		success,
	} = useSelector((state) => state.hookUnsubscribe);

	const [connected, setConnect] = useState(hookDetails.id.length > 1);

	useEffect(() => {
		if (hookDetails.id === '') {
			dispatch(getApiKey('key'));
		}
		if (hookDetails.id.length > 1) {
			setConnect(true);
			navigate('/cpanel');
		} else {
			setConnect(false);
		}
	}, [hookDetails.id, dispatch, navigate, success, connected]);

	const subscribeHandler = () => {
		dispatch(subscribeHook());
	};
	const unSubscribeHandler = () => {
		dispatch(unSubscribeHook(hookDetails.id));
	};
	return (
		<>
			{loading && <Spinner loading={loading} />}
			{loadingUnsubscribe && <Spinner loading={loadingUnsubscribe} />}
			{loadingHookApi && <Spinner loading={loadingHookApi} />}

			{!loading && !loadingHookApi && !loadingUnsubscribe && (
				<div className='pt-10 mx-auto container flex justify-center items-center flex-col'>
					<div
						className={clsx(
							'rounded-full w-64 h-64 bg-red-100 text-center flex items-center justify-center',
							{ '!bg-green-100': connected }
						)}>
						<div
							className={clsx(
								'rounded-full font-bold bg-red-500 w-48 h-48 flex items-center justify-center text-white text-xl',
								{ '!bg-green-300 text-green-700': connected }
							)}>
							{connected ? (
								<>
									SERVER
									<br />
									CONNECTED
								</>
							) : (
								<>
									SERVER
									<br />
									DISCONNECTED
								</>
							)}
						</div>
					</div>
					{connected ? (
						<button
							onClick={unSubscribeHandler}
							className='btn bg-red-500 border-0 mt-5 hover:!bg-red-700'>
							DISCONNECT
						</button>
					) : (
						<button
							onClick={subscribeHandler}
							className='btn btn-success hover:bg-green-400 text-white mt-5'>
							CONNECT
						</button>
					)}
					<p className='mt-4 w-96'>
						<span className='font-bold text-slate-900'>NOTE</span> : use
						*DISCONNECT* button when you don't need this feature anymore.
					</p>
				</div>
			)}
		</>
	);
}
