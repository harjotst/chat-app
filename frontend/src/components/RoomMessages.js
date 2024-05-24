import React, { useState, useEffect, useRef } from 'react';

import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFile } from '@fortawesome/free-solid-svg-icons';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';

const RoomMessages = () => {
	const { user } = useUser();

	const { messages, currentRoom, fetchMoreMessages } = useChat();

	const messagesDivRef = useRef(null);

	const [lastMessage, setLastMessage] = useState(null);

	const [lastScrollHeight, setLastScrollHeight] = useState(0);

	const calculateMessageClass = (message) => {
		if (message.userId._id === user.id) {
			return 'inline-flex flex-row justify-end';
		} else {
			return 'inline-flex flex-row justify-start';
		}
	};

	const formatMessage = (message, key) => {
		const messageContent =
			message.messageInformation.translation?.message || message.messageInformation.message;
		const username = message.userId.username;
		const ago = moment(message.createdAt).local().fromNow();

		return (
			<div key={key} className={calculateMessageClass(message)}>
				<div className='p-2 rounded-md bg-gray-200 max-w-sm'>
					<div className='flex flex-row justify-between items-center'>
						<h4 className='font-bold pr-1'>{username}</h4>
						<span className='text-sm font-light pl-1'>{ago}</span>
					</div>
					<span>{messageContent}</span>
				</div>
			</div>
		);
	};

	const formatFileAttachment = (message, key) => {
		const username = message.userId.username;
		const ago = moment(message.createdAt).local().fromNow();

		return (
			<div key={key} className={calculateMessageClass(message)}>
				<div className='p-2 rounded-md bg-gray-200 max-w-sm'>
					<div className='flex flex-row justify-between items-center'>
						<h4 className='font-bold pr-1'>{username}</h4>
						<span className='text-sm font-light pl-1'>{ago}</span>
					</div>
					<a
						href={message.fileAddr}
						className='w-fit block border border-gray-600 bg-gray-600 text-white px-2 py-1 mt-1 rounded-md'
					>
						<FontAwesomeIcon icon={faFile} />
						<span> {message.fileName}</span>
					</a>
				</div>
			</div>
		);
	};

	const formatEvent = (message, key) => {
		const { username } = message.userId;
		const ago = moment(message.createdAt).local().fromNow();
		const { eventType } = message;

		const action =
			eventType === 'join'
				? 'Joined!'
				: eventType === 'leave'
				? 'Left!'
				: eventType === 'kick'
				? 'was Kicked!'
				: 'Huh?!';

		return (
			<div key={key} className='flex items-center'>
				<div className='flex-1 border-t border-gray-300'></div>
				<span className='mx-2'>
					{username} {action}
				</span>
				<div className='flex-1 border-t border-gray-300'></div>
			</div>
		);
	};

	const handleScroll = (event) => {
		if (event.target.scrollTop === 0) {
			fetchMoreMessages(currentRoom._id);
		}
	};

	useEffect(() => {
		if (lastScrollHeight !== messagesDivRef.current.scrollHeight) {
			messagesDivRef.current.scrollTop =
				messagesDivRef.current.scrollHeight - lastScrollHeight;

			setLastScrollHeight(messagesDivRef.current.scrollHeight);
		}

		if (
			!lastMessage ||
			(messagesDivRef.current &&
				lastMessage._id !==
					messages[currentRoom._id][messages[currentRoom._id].length - 1]._id)
		) {
			messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;

			setLastMessage(messages[currentRoom._id][messages[currentRoom._id].length - 1]);
		}
	}, [currentRoom, messages, messagesDivRef.current]);

	return (
		<div
			id='thing'
			className='flex flex-col space-y-4 overflow-y-scroll p-4 flex-grow'
			onScroll={handleScroll}
			ref={messagesDivRef}
		>
			<>
				{messages[currentRoom._id].map((message, index) => {
					if (message.contentType === 'message') return formatMessage(message, index);
					else if (message.contentType === 'file')
						return formatFileAttachment(message, index);
					else return formatEvent(message, index);
				})}
			</>
		</div>
	);
};

export default RoomMessages;
