import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8800'; // adjust to match your backend URL

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export const initializeSocket = (currentUser) => {
  socket.emit('addUser', currentUser.id);
}; 