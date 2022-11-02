import ClipLoader from 'react-spinners/ClipLoader';
import clsx from 'clsx';

export default function Spinner({ loading }) {
	return (
		<>
			<input type='checkbox' id='my-modal' className='modal-toggle' />
			<div
				className={clsx('modal', {
					'modal-open': loading,
				})}>
				<div className='modal-box bg-transparent shadow-none'>
					<ClipLoader
						color={'yellow'}
						loading={loading}
						size={150}
						aria-label='Loading Spinner'
						data-testid='loader'
					/>
					<h3 className='font-medium text-2xl text-white'>Please wait...</h3>
				</div>
			</div>
		</>
	);
}
