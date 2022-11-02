import { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { BoltIcon } from '@heroicons/react/24/outline';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logoutAdmin } from '../../actions/adminActions';
import { ADMIN_LOGOUT } from '../../constants/adminConstants';

export default function Home() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { loading, adminInfo, error } = useSelector(
		(state) => state.adminLogin
	);

	useEffect(() => {
		if (adminInfo && !adminInfo.isAdmin) {
			navigate('/login');
		}
	}, [adminInfo, navigate]);

	const logoutHandler = () => {
		localStorage.removeItem('adminInfo');
		dispatch({ type: ADMIN_LOGOUT });
	};

	return (
		<div>
			<div className='navbar px-32 border-b-2 border-slate-200'>
				<div className='flex-1'>
					<Link
						to='/'
						className='capitalize flex font-medium text-warning text-xl cursor-pointer'>
						Dashboard
						<BoltIcon size='1rem' />
					</Link>
				</div>
				<div className='flex-2 gap-2'>
					<div className='form-control'>
						{/* <input
						type='text'
						placeholder='Search'
						className='input input-bordered'
					/> */}
					</div>
					<div className='dropdown dropdown-end'>
						<label
							tabIndex={0}
							className='btn btn-ghost btn-circle avatar flex items-center justify-center bg-slate-50 shadow-sm'>
							<div className='w-10 rounded-full py-1 px-2'>
								<h1 className='font-medium text-lg text-slate-500'>JA</h1>
							</div>
						</label>
						<ul
							tabIndex={0}
							className='mt-3 p-2 shadow-md menu menu-compact dropdown-content bg-slate-50 shadow-sm rounded-box w-52'>
							<li>
								<button
									onClick={logoutHandler}
									className='justify-between text-slate-900 font-medium'>
									Logout
								</button>
							</li>
							<li>
								<Link
									to='/cpanel'
									className='justify-between text-slate-900 font-medium'>
									Control Panel
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<Outlet />
		</div>
	);
}
