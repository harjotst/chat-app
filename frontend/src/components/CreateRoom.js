import React, { useState } from 'react';

import PopUp from '../components/PopUp';

import { createRoom, getMyRooms, joinRoom } from '../services/room';

import { useChat } from '../hooks/useChat';

export default function CreateRoom() {
  const { setRooms, fetchInitialMessages } = useChat();

  const [create, setCreate] = useState(null);

  const [newRoomName, setNewRoomName] = useState('');

  const [joinCode, setJoinCode] = useState('');

  const [popUpOpen, setPopUpOpen] = useState(false);

  const closePopUp = () => {
    setPopUpOpen(false);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const roomId = await createRoom(newRoomName);

      const rooms = await getMyRooms();

      await fetchInitialMessages(roomId);

      setRooms(rooms);

      setNewRoomName('');

      setPopUpOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;

    try {
      const roomId = await joinRoom(joinCode);

      const rooms = await getMyRooms();

      await fetchInitialMessages(roomId);

      setRooms(rooms);

      setJoinCode('');

      setPopUpOpen('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className='flex flex-row items-center justify-between p-4 py-7 border-b border-gray-300'>
        <h2 className='text-base font-bold'>Rooms</h2>
        <div className='flex flex-row items-center'>
          <button
            className='text-sm p-2 border border-gray-300 hover:border-gray-400 rounded-lg text-gray-500 hover:text-gray-600 transition-all duration-75'
            onClick={() => {
              setCreate(true);
              setPopUpOpen(true);
            }}
          >
            Create
          </button>
          <span className='px-2'>or</span>
          <button
            className='text-sm p-2 border border-gray-300 hover:border-gray-400 rounded-lg text-gray-500 hover:text-gray-600 transition-all duration-75'
            onClick={() => {
              setCreate(false);
              setPopUpOpen(true);
            }}
          >
            Join
          </button>
        </div>
      </div>
      <PopUp show={popUpOpen} close={closePopUp}>
        <h1 className='text-2xl mb-4'>
          {create ? 'Create Group Chat' : 'Join Group Chat'}
        </h1>
        <div className='mb-4'>
          <label
            htmlFor={create ? 'groupName' : 'roomCode'}
            className='block text-sm font-medium text-gray-600'
          >
            {create ? 'Group Name' : 'Room Code'}
          </label>
          <input
            type='text'
            id={create ? 'newRoomName' : 'roomCode'}
            name={create ? 'newRoomName' : 'roomCode'}
            value={create ? newRoomName : joinCode}
            onChange={
              create
                ? (e) => setNewRoomName(e.target.value)
                : (e) => setJoinCode(e.target.value)
            }
            className='mt-1 p-2 w-full rounded-md border shadow-sm'
            placeholder={
              create ? 'Enter group chat name' : 'Enter group chat code'
            }
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700'
          onClick={create ? handleCreateRoom : handleJoinRoom}
        >
          {create ? 'Create' : 'Join'}
        </button>
      </PopUp>
    </>
  );
}
