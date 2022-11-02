import { FaPlus } from 'react-icons/fa';
import { BoltIcon } from '@heroicons/react/24/outline';

export default function Events() {
	return (
		<div>
			<div className='overflow-none relative max-w-2xl mx-auto mt-5'>
				<div className='container pt-10 '>
					<p className=' font-medium text-slate-900 text-lg mb-8 text-left'>
						All Events
					</p>
				</div>
				<table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-transparent table-compact'>
					<thead className='text-xs text-gray-700 uppercase  bordered border-2 border-b-0 bg-slate-200'>
						<tr>
							<td className='py-3 px-6'>Event Name</td>
							<td className='py-3 px-6'>Action</td>
							<td className='py-3 px-6'>Status</td>
						</tr>
					</thead>
					<tbody>
						<tr className='bg-slate-900 border border-b-2 border-gray-600'>
							<th
								scope='row'
								className='py-4 px-6 font-medium text-gray-100 whitespace-nowrap dark:text-white'>
								New Lead Sms
							</th>
							<th
								scope='row'
								className='py-6 px-6 font-medium text-gray-100 whitespace-nowrap dark:text-white'>
								Forward Sms
							</th>
							<td className='py-4 px-6  w-16 font-medium'>
								<span className='py-3 px-6 bg-green-200 w-16 font-medium my-4 text-green-600 rounded-md'>
									Active
								</span>
							</td>
						</tr>
						<tr className='bg-slate-900'>
							<th
								scope='row'
								className='py-6 px-6 font-medium text-gray-100 whitespace-nowrap dark:text-white'>
								New Lead Sms
							</th>
							<th
								scope='row'
								className='py-4 px-6 font-medium text-gray-100 whitespace-nowrap dark:text-white'>
								Forward Email
							</th>
							<td className='py-4 px-6  w-16 font-medium'>
								<span className='py-3 px-6 bg-green-200 w-16 font-medium my-4 text-green-600 rounded-md'>
									Active
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
