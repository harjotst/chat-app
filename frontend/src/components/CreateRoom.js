import React, { useState } from 'react';

import PopUp from '../components/PopUp';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { createRoom } from '../services/room';

export default function CreateRoom() {
  const [newRoomName, setNewRoomName] = useState('');

  const [popUpOpen, setPopUpOpen] = useState(false);

  const closePopUp = () => {
    setPopUpOpen(false);
  };

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    createRoom(newRoomName)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    setNewRoomName('');

    setPopUpOpen(false);
  };

  return (
    <>
      <div className='flex flex-row justify-between px-6 py-7 border-b border-gray-300'>
        <h2 className='text-base font-bold'>Rooms</h2>
        <button
          className='flex items-center justify-center bg-transparent font-bold'
          onClick={() => setPopUpOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <PopUp show={popUpOpen} close={closePopUp}>
        <h1 className='text-2xl mb-4'>Create Group Chat</h1>
        <div className='mb-4'>
          <label
            htmlFor='groupName'
            className='block text-sm font-medium text-gray-600'
          >
            Group Name
          </label>
          <input
            type='text'
            id='newRoomName'
            name='newRoomName'
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className='mt-1 p-2 w-full rounded-md border shadow-sm'
            placeholder='Enter group chat name'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700'
          onClick={handleCreateRoom}
        >
          Create
        </button>
      </PopUp>
    </>
  );
}
