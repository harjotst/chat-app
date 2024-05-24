import React, { useState, useCallback, useEffect } from 'react';

import { useUser } from '../hooks/useUser';

import { useChat } from '../hooks/useChat';

import { getRoomMembers } from '../services/room';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	faBars,
	faXmark,
	faRightFromBracket,
	faCopy,
	faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

const RoomHeader = () => {
	const { user } = useUser();

	const {
		currentRoom,
		resetCurrentRoomCode,
		leaveCurrentRoom,
		kickUserFromCurrentRoom,
		currentRoomMembers,
		getCurrentRoomsMembers,
	} = useChat();

	const [settingsVisible, setSettingsVisible] = useState(false);

	const [textCopied, setTextCopied] = useState(false);

	const [renewing, setRenewing] = useState(false);

	const showSettings = async () => {
		setSettingsVisible(true);

		if (currentRoomMembers.length === 0) {
			getCurrentRoomsMembers();
		}
	};

	const hideSettings = () => {
		setSettingsVisible(false);
	};

	const handleCopy = async () => {
		try {
			setTextCopied(true);

			await navigator.clipboard.writeText(currentRoom.joinCode);

			setTimeout(() => {
				setTextCopied(false);
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text to clipboard', err);
		}
	};

	const handleRenewRoomCode = async () => {
		setRenewing(true);

		await resetCurrentRoomCode();

		setRenewing(false);
	};

	useEffect(() => {
		console.log(currentRoomMembers);
	}, [currentRoomMembers]);

	return (
		<>
			<div className='flex justify-between items-center p-4 py-7 border-b border-gray-300'>
				<div className='font-bold'>{currentRoom.name}</div>
				<FontAwesomeIcon
					icon={faBars}
					className='text-xl mr-2 hover:cursor-pointer'
					onClick={showSettings}
				/>
			</div>
			<div
				className={`absolute top-0 right-0 w-2/3 h-full p-4 py-7 border-l border-l-gray-300 bg-white transition-transform ${
					settingsVisible ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='flex flex-row justify-between items-center mb-5'>
					<h1 className='text-lg font-medium'>Room Settings</h1>
					<FontAwesomeIcon
						icon={faXmark}
						className='text-xl cursor-pointer mr-2'
						onClick={hideSettings}
					/>
				</div>
				<div className='mb-3'>
					<h2 className='mb-2'>Actions: </h2>
					<button
						className='text-sm px-3 py-2 mr-2 rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-75'
						onClick={handleCopy}
					>
						{!textCopied ? 'Copy Join Code' : 'Join Code Copied!'}&nbsp;&nbsp;
						<FontAwesomeIcon icon={faCopy} />
					</button>
					{currentRoom.createdBy === user.id && (
						<button
							className='text-sm px-3 py-2 mr-2 rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-75'
							onClick={handleRenewRoomCode}
						>
							{!renewing ? 'Renew Join Code' : 'Renewing...'}&nbsp;&nbsp;
							<FontAwesomeIcon icon={faRotateRight} />
						</button>
					)}
					<button
						className='text-sm px-3 py-2 rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-75'
						onClick={leaveCurrentRoom}
					>
						Leave this Chat Room&nbsp;&nbsp;
						<FontAwesomeIcon icon={faRightFromBracket} />
					</button>
				</div>
				<h2 className='mb-1'>Members:</h2>
				{currentRoomMembers.map((member, index) => (
					<div key={index} className='flex flex-row items-center p-2'>
						<div className='w-14 h-14 overflow-hidden inline-flex items-center justify-center mr-2'>
							<img
								src={member.profilePicture}
								className='object-cover h-full w-full'
							/>
						</div>
						<span>
							{member.username}{' '}
							{currentRoom.createdBy === member._id && <span>(Admin)</span>}
						</span>
						{currentRoom.createdBy === user.id && member._id !== user.id && (
							<button
								className='text-sm px-3 py-2 ml-auto cursor-pointer rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-75'
								onClick={async () => {
									await kickUserFromCurrentRoom(member._id);
								}}
							>
								Kick
							</button>
						)}
					</div>
				))}
			</div>
		</>
	);
};

export default RoomHeader;
