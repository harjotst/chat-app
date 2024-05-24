import { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Chat, SignUpLogIn } from './components/index';

import { useUser } from './hooks/useUser';

import UnprotectedRoute from './auth/UnprotectedRoute';

import ProtectedRoute from './auth/ProtectedRoute';

import { validateSession } from './services/user';

import { ChatProvider } from './context/ChatContext';

function App() {
	const { setUser } = useUser();

	useEffect(() => {
		const checkSession = async () => {
			try {
				const session = await validateSession();

				setUser(session.user);
			} catch (error) {
				console.log('Session is invalid:', error);
			}
		};

		checkSession();
	}, []);

	return (
		<ChatProvider>
			<Router>
				<Routes>
					<Route path='/' element={<UnprotectedRoute children={<SignUpLogIn />} />} />
					<Route path='/chat' element={<ProtectedRoute children={<Chat />} />} />
				</Routes>
			</Router>
		</ChatProvider>
	);
}

export default App;
