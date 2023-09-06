import React from 'react';

import { useChat } from '../hooks/useChat';

export default function RoomList() {
  const { rooms, currentRoom, setCurrentRoom } = useChat();

  const computeRoomStyles = (roomId) => {
    if (currentRoom && currentRoom._id !== roomId) {
      return 'w-full p-4 cursor-pointer hover:bg-gray-100';
    } else {
      return 'w-full p-4 cursor-pointer bg-gray-200';
    }
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
            {room.name}
          </div>
        );
      })}
    </div>
  );
}
