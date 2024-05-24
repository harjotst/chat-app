import React from 'react';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';

export default function RoomsList() {
	const { user } = useUser();

	const { rooms, messages, currentRoom, setCurrentRoom } = useChat();

	const computeRoomStyles = (roomId) => {
		if (!currentRoom || (currentRoom && currentRoom._id !== roomId)) {
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

		if (lastMessage.contentType === 'file') {
			messageContent = lastMessage.fileName;
		} else if (lastMessage.contentType === 'event') {
			const { eventType } = lastMessage;

			const action =
				eventType === 'join'
					? 'Joined!'
					: eventType === 'leave'
					? 'Left!'
					: eventType === 'kick'
					? 'was Kicked!'
					: 'Huh?!';

			messageContent = `${lastMessage.userId.username} ${action}`;
		} else if (lastMessage.messageInformation.language !== user.preferredLanguage) {
			messageContent = lastMessage.messageInformation.translation.message;
		} else {
			messageContent = lastMessage.messageInformation.message;
		}

		return `${username}: ${messageContent}`;
	};

	return (
		<div className='flex flex-col overflow-y-scroll no-scrollbar flex-grow'>
			{rooms.map((room) => {
				return (
					<div
						key={room._id}
						className={computeRoomStyles(room._id)}
						onClick={() => setCurrentRoom(room)}
					>
						<p className='font-medium text-gray-700'>{room.name}</p>
						<p className='truncate w-full'>{getLastMessage(room._id)}</p>
					</div>
				);
			})}
		</div>
	);
}
