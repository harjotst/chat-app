import React, { useEffect, useState } from 'react';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';

import moment from 'moment';

export default function Room() {
  const { user } = useUser();
  const { messages, currentRoom, fetchMoreMessages, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentRoom && messages[currentRoom._id]) {
      setLoading(false);
    }
  }, [currentRoom, messages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const calculateMessageClass = (message) => {
    if (message.userId._id === user.id) {
      return 'inline-flex flex-row justify-end max-';
    } else {
      return 'inline-flex flex-row justify-start';
    }
  };

  return (
    <section className='w-3/4 bg-white overflow-auto flex flex-col justify-between'>
      <div className='flex justify-start items-center p-4 py-7 border-b border-gray-300'>
        {/* <img
          className='w-12 h-12 rounded-full mr-4'
          src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt="Person's picture"
        /> */}
        <div className='font-bold'>{currentRoom.name}</div>
        {/* <button className='ml-auto w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full'>
              <FontAwesomeIcon icon={faInfo} />
            </button> */}
      </div>
      <div className='flex flex-col space-y-4 overflow-y-scroll p-4 '>
        {messages[currentRoom._id].map((message, index) => {
          let messageContent;

          if (message.messageInformation.language !== user.preferredLanguage) {
            messageContent = message.messageInformation.translations.find(
              (translation) => translation.language === user.preferredLanguage
            ).message;
          } else {
            messageContent = message.messageInformation.message;
          }

          const username = message.userId.username;

          const ago = moment(message.createdAt).local().fromNow();

          return (
            <div key={index} className={calculateMessageClass(message)}>
              <div className='p-2 rounded-md bg-gray-200 max-w-sm'>
                <div className='flex flex-row justify-between items-center'>
                  <h4 className='font-bold pr-1'>{username}</h4>
                  <span className='text-sm font-light pl-1'>{ago}</span>
                </div>
                <span>{messageContent}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className='mt-4 flex flex-row items-center space-x-2 p-4 pt-0'>
        {/* <button className='w-9 h-8 flex items-center justify-center bg-transparent border border-gray-500 text-gray-500 font-bold rounded-full'>
                <FontAwesomeIcon icon={faPlus} />
              </button> */}
        <input
          type='text'
          className='w-full px-3 py-2 border border-gray-400 focus:border-gray-600 focus:outline-none focus:shadow-md rounded-md bg-gray-100 placeholder-gray-400 text-black'
          placeholder='Type your message here'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className='px-3 py-2 bg-blue-500 text-white rounded-md'
          onClick={() => {
            sendMessage(currentRoom._id, message);
            setMessage('');
          }}
        >
          Send
        </button>
      </div>
    </section>
  );
}
