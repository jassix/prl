import { io } from 'socket.io-client';

const Connect = () => {
  const socket = io('http://localhost:5001');
  socket.on('connect', () => {
    console.log(
      `User connected under ${socket.id} ${
        localStorage.getItem('nickname') ? `with nickname ${localStorage.getItem('nickname')}` : ``
      }`
    );
  });

  socket.on('disconnect', () => console.log('server disconnected'));
};

export default Connect;
