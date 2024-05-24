import React from 'react';

import { useChat } from '../hooks/useChat';

import RoomHeader from './RoomHeader';
import RoomMessages from './RoomMessages';
import RoomMessageInput from './RoomMessageInput';

export default function Room() {
	const { messages, currentRoom } = useChat();

	const showChatRoom = currentRoom && messages;

	return (
		<>
			{showChatRoom ? (
				<section className='relative w-2/3 bg-white overflow-x-hidden flex flex-col justify-between'>
					<RoomHeader />
					<RoomMessages />
					<RoomMessageInput />
				</section>
			) : (
				<section className='w-2/3 bg-white overflow-auto flex flex-col justify-center items-center'>
					<p className='w-96 text-center text-gray-700'>
						Pick a room to see the chats. No room yet? Feel free to create or join one
						and get the conversation started!
					</p>
				</section>
			)}
		</>
	);
}
