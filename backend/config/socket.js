const socketIo = require('socket.io');

const httpServer = require('./server');
const config = require('./config');

const initiateSockets = () => {
	const io = socketIo(httpServer, {
		cors: {
			origin: `http://${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`,
			methods: ['GET', 'POST'],
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		console.log('Connected', socket.id);

		socket.on('join_rooms', (rooms) => {
			console.log(`${socket.id} joined rooms: ${rooms}`);

			rooms.forEach((room) => {
				socket.join(room);
			});
		});

		socket.on('join_room', (roomId) => {
			console.log(`${socket.id} joined: ${roomId}`);

			socket.join(roomId);
		});

		socket.on('message_activity', (message, room) => {
			console.log(`${socket.id} sent a message: ${message}, ${room}`);

			io.to(room).emit('message_activity', message);
		});

		socket.on('file_activity', (file, room) => {
			console.log(`${socket.id} sent a file: ${file}, ${room}`);

			io.to(room).emit('file_activity', file);
		});

		socket.on('event_activity', (event, room) => {
			console.log(`${socket.id} sent an event: ${event}, ${room}`);

			io.to(room).emit('event_activity', event);
		});

		socket.on('disconnect', () => {
			for (const room in socket.rooms) {
				if (socket.id !== room) {
					socket.leave(room);

					console.log(`${socket.id} left room: ${room}`);
				}
			}
		});
	});
};

module.exports = initiateSockets;
