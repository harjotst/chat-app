import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

import env from '../config/env';

export let sharedSocket;

export const resetSharedSocket = () => {
  if (sharedSocket) {
    sharedSocket.disconnect();
  }

  sharedSocket = null;
};

export const useSocket = (eventName, callback) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = io(process.env.REACT_APP_API_URL, {
        withCredentials: true,
      });
    }

    setSocket(sharedSocket);

    if (eventName && callback) {
      sharedSocket.on(eventName, callback);
    }

    return () => {
      if (eventName && callback) {
        sharedSocket.off(eventName, callback);
      }
    };
  }, [eventName, callback]);

  const emitEvent = (eventName, data) => {
    if (sharedSocket) {
      sharedSocket.emit(eventName, data);
    }
  };

  return { emitEvent };
};
