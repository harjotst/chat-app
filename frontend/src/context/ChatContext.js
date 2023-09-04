import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSocket } from '../hooks/useSocket';

import apiClient from '../services/api';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentRoom, setCurrentRoom] = useState(null);
  const { emitEvent } = useSocket();

  const fetchInitialMessages = async (roomId) => {
    const response = await apiClient.get(`/room/${roomId}/messages/1`, {
      withCredentials: true,
    });
    const newMessages = response.data.messages;
    setMessages((prevMessages) => ({ ...prevMessages, [roomId]: newMessages }));
  };

  useEffect(() => {
    const fetchRoomsAndInitialMessages = async () => {
      const roomResponse = await apiClient.get('/room/my-rooms', {
        withCredentials: true,
      });
      const fetchedRooms = roomResponse.data.rooms;

      setRooms(fetchedRooms);

      emitEvent(
        'join_rooms',
        fetchedRooms.map((room) => room._id)
      );

      if (fetchedRooms.length > 0) {
        setCurrentRoom(fetchedRooms[0]);
      }

      for (const room of fetchedRooms) {
        await fetchInitialMessages(room._id);
      }
    };

    fetchRoomsAndInitialMessages();
  }, []);

  useSocket('new_message', (newMessage) => {
    setMessages((prevMessages) => {
      const { roomId } = newMessage;
      const roomMessages = prevMessages[roomId] || [];
      return { ...prevMessages, [roomId]: [...roomMessages, newMessage] };
    });
  });

  const fetchMoreMessages = async (roomId, page) => {
    const response = await apiClient.get(`/room/${roomId}/messages/${page}`, {
      withCredentials: true,
    });
    const moreMessages = response.data.messages;
    setMessages((prevMessages) => {
      const existingMessages = prevMessages[roomId] || [];
      return {
        ...prevMessages,
        [roomId]: [...existingMessages, ...moreMessages],
      };
    });
  };

  const sendMessage = async (roomId, content) => {
    try {
      const messageResponse = await apiClient.post(
        `/room/${roomId}/create-message`,
        { content },
        {
          withCredentials: true,
        }
      );
      const { message } = messageResponse.data;

      emitEvent('new_message', message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        messages,
        currentRoom,
        setCurrentRoom,
        fetchMoreMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
