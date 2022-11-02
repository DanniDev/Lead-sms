import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loginAdmin } from '../../actions/adminActions';

export default function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { loading, adminInfo, error } = useSelector(
		(state) => state.adminLogin
	);

	useEffect(() => {
		console.log(adminInfo === true);
		if (adminInfo && adminInfo.isAdmin) {
			navigate('/');
		}
	}, [adminInfo, navigate]);

	const onSubmitHandler = (e) => {
		e.preventDefault();
		if (!password && email) {
			alert('Please fill in all fields!');
		} else {
			dispatch(loginAdmin({ email, password }));
		}
	};

	return (
		<div className='w-full h-screen' style={{ background: '#ebecee' }}>
			<div className='container text-center w-full h-full flex justify-center items-center'>
				<div className='text-slate-700'>
					<h1 className='text-slate-900 text-xl font-bold mb-3'>ADMIN LOGIN</h1>
					<p>Welcome back Jean, Sign in to continue</p>
					<form className='mt-4' onSubmit={onSubmitHandler}>
						<div className='form-control my-3'>
							<label className='input-group input-group-lg'>
								<input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									type='email'
									placeholder='Enter email address'
									className='input w-full bg-slate-50 rounded-md placeholder:text-gray-400 py-2 pl-3 shadow-md border-slate-300'
								/>
							</label>
						</div>
						<div className='form-control my-3'>
							<label className='input-group input-group-lg'>
								<input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									type='password'
									placeholder='Enter password'
									className='input w-full bg-slate-50 rounded-md placeholder:text-gray-400 py-2 pl-3 shadow-md border-slate-300'
								/>
							</label>
						</div>
						<button
							type='submit'
							className='mt-5 mb-5 w-full px-5 py-2 btn btn-warning rounded-lg block text-sm hover:bg-yellow-500'>
							Sign In
						</button>
					</form>
					<p className='text-red-600'>{error}</p>
				</div>
			</div>
		</div>
	);
}
