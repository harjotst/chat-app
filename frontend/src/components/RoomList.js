import React from 'react';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';

export default function RoomList() {
  const { user } = useUser();

  const { rooms, messages, currentRoom, setCurrentRoom } = useChat();

  const computeRoomStyles = (roomId) => {
    if (currentRoom && currentRoom._id !== roomId) {
      return 'w-full p-4 cursor-pointer hover:bg-gray-100';
    } else {
      return 'w-full p-4 cursor-pointer bg-gray-200';
    }
  };

  const getLastMessage = (roomId) => {
    if (!messages[roomId] || !messages[roomId].length || !user) {
      return;
    }

    const lastMessage = messages[roomId][messages[roomId].length - 1];

    const username = lastMessage.userId.username;

    let messageContent = null;

    if (lastMessage.messageInformation.language !== user.preferredLanguage) {
      messageContent = lastMessage.messageInformation.translation.message;
    } else {
      messageContent = lastMessage.messageInformation.message;
    }

    return `${username}: ${messageContent}`;
  };

  return (
    <div className='flex flex-col overflow-scroll'>
      {rooms.map((room) => {
        return (
          <div
            key={room._id}
            className={computeRoomStyles(room._id)}
            onClick={() => setCurrentRoom(room)}
          >
            <p className='font-bold'>{room.name}</p>
            <p className='truncate w-full'>{getLastMessage(room._id)}</p>
          </div>
        );
      })}
    </div>
  );
}
