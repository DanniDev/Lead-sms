import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Events from './components/pages/Events';
import Panel from './components/pages/Panel.jsx';

const App = () => {
	return (
		<Provider store={store}>
			<div className='App !overflow-hidden !lg:w-full !h-screen !bg-slate-100'>
				<Router>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route element={<Home />}>
							<Route index element={<Events />} />
							<Route path='/cpanel' element={<Panel />} />
						</Route>
					</Routes>
				</Router>
			</div>
		</Provider>
	);
};

export default App;
