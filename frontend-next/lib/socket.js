import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

let socket = null;

export function initSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }

  return socket;
}

export function getSocket() {
  return socket || initSocket();
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
