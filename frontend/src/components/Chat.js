import React from 'react';

import CreateRoom from './CreateRoom';

import RoomList from './RoomList';

import UserInfo from './UserInfo';

import Room from './Room';

export default function Chat() {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-9/12 h-5/6 flex border border-gray-300 rounded-lg shadow-xl bg-white overflow-hidden'>
        <aside className='flex flex-col justify-start w-1/3 overflow-auto border-r border-gray-300'>
          <CreateRoom />
          <RoomList />
          <UserInfo />
        </aside>
        <Room />
      </div>
    </div>
  );
}
