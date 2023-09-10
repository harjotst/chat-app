import React, { useEffect, useRef, useState } from 'react';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';

import moment from 'moment';

export default function Room() {
  const { user } = useUser();
  const { messages, currentRoom, fetchMoreMessages, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [joinCodeText, setJoinCodeText] = useState('Copy Join Code');

  const scrollableDivRef = useRef();

  useEffect(() => {
    if (currentRoom && messages[currentRoom._id] && scrollableDivRef.current) {
      setLoading(false);
      const div = scrollableDivRef.current;
      div.scrollTop = div.scrollHeight;
    }
  }, [currentRoom, messages, scrollableDivRef]);

  const calculateMessageClass = (message) => {
    if (message.userId._id === user.id) {
      return 'inline-flex flex-row justify-end max-';
    } else {
      return 'inline-flex flex-row justify-start';
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(currentRoom.joinCode).then(() => {
      console.log('Text copied to clipboard');

      setJoinCodeText('Join Code Copied');

      setTimeout(() => {
        setJoinCodeText('Copy Join Code');
      }, 1750);
    });
  };

  return (
    <section className='w-2/3 bg-white overflow-auto flex flex-col justify-between'>
      <div className='flex justify-between items-center p-4 py-7 border-b border-gray-300'>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* <img
          className='w-12 h-12 rounded-full mr-4'
          src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt="Person's picture"
        /> */}
            <div className='font-bold'>{currentRoom.name}</div>
            <button
              className='text-sm p-2 border border-gray-300 hover:border-gray-400 rounded-lg text-gray-500 hover:text-gray-600 transition-all duration-75'
              onClick={copyJoinCode}
            >
              {joinCodeText}
            </button>
            {/* <button className='ml-auto w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full'>
              <FontAwesomeIcon icon={faInfo} />
            </button> */}
          </>
        )}
      </div>
      <div
        ref={scrollableDivRef}
        className='flex flex-col space-y-4 overflow-y-scroll p-4 flex-grow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                '
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {messages[currentRoom._id].map((message, index) => {
              let messageContent;

              if (message.messageInformation.translation === undefined) {
                messageContent = message.messageInformation.message;
              } else {
                messageContent = message.messageInformation.translation.message;
              }

              const username = message.userId.username;

              const ago = moment(message.createdAt).local().fromNow();

              // console.log(message);

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
          </>
        )}
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
