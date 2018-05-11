import io from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:1337';
const rooms = Symbol('rooms');

const socket = io(socketUrl);
socket[rooms] = [];
socket.joinRoom = (room) => {
  socket[rooms].push(room);
  socket.emit('join_room', room);
};
socket.leaveRoom = (room) => {
  socket[rooms] = socket[rooms].filter(r => r !== room);
  socket.emit('leave_room', room);
};



socket.on('reconnect', () => {
  socket[rooms].forEach(room => socket.emit('join_room', room));
});

socket.on('connect', () => {
  console.log('connected to socket');
});

socket.on('disconnect', () => console.log('disconnected from socket'));

export default () => socket;