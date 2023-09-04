import React from 'react';

import { useUser } from '../hooks/useUser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function UserInfo() {
  const { user } = useUser();

  return (
    <div className='flex items-center justify-between border-t px-4 py-4 mt-auto'>
      <div className='flex items-center'>
        <img
          className='w-10 h-10 rounded-full'
          src={user.pfp}
          alt="User's picture"
        />
        <div className='ml-4 font-bold'>{user.name}</div>
      </div>
      <button className='flex items-center justify-center border border-gray-300 hover:border-gray-400 rounded-full text-gray-500 hover:text-gray-600 w-10 h-10 transition-all duration-75'>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
    </div>
  );
}
