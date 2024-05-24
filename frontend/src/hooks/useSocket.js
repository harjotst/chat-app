import { useEffect } from 'react';

import { io } from 'socket.io-client';

let globalSocket = null;

export const useSocket = (events) => {
	const createSocket = () => {
		if (!globalSocket) {
			globalSocket = io(process.env.REACT_APP_API_URL, {
				withCredentials: true,
			});
		}
		return globalSocket;
	};

	useEffect(() => {
		const newSocket = createSocket();

		if (events && events.length) {
			events.forEach(({ eventName, callback }) => {
				console.log('Setting up event listener for:', eventName);

				newSocket.on(eventName, callback);
			});
		}

		return () => {
			if (events && events.length && newSocket) {
				events.forEach(({ eventName, callback }) => {
					newSocket.off(eventName, callback);
				});
			}

			newSocket.disconnect();
		};
	}, [events]);

	const emitEvent = (eventName, data) => {
		const newSocket = createSocket();

		console.log('Emit event:', eventName);

		newSocket.emit(eventName, data);
	};

	return { emitEvent };
};
