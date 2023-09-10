const socketIo = require('socket.io');

const httpServer = require('./server');

const initiateSockets = () => {
  const io = socketIo(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // console.log('Connected', socket.id);

    socket.on('join_rooms', (rooms) => {
      rooms.forEach((room) => {
        socket.join(room._id);
      });
    });

    socket.on('new_message', (message, room) => {
      io.to(room).emit('new_message', message);
    });

    socket.on('disconnect', () => {
      // console.log('Disconnected', socket.id);
    });
  });
};

module.exports = initiateSockets;
