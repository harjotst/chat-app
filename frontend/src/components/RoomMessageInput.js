import React, { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faFile, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useChat } from '../hooks/useChat';

const RoomMessageInput = () => {
	const { currentRoom, sendMessage, sendFile } = useChat();
	const fileInputRef = useRef(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [message, setMessage] = useState('');

	const handleFileChange = useCallback((e) => {
		setSelectedFile(e.target.files[0]);
	}, []);

	const handleSend = useCallback(() => {
		if (selectedFile) {
			const fileData = new FormData();
			fileData.append('file', selectedFile);
			sendFile(currentRoom._id, fileData);
			setSelectedFile(null);
		} else {
			sendMessage(currentRoom._id, message);
			setMessage('');
		}
	}, [selectedFile, message, currentRoom._id, sendFile, sendMessage]);

	const handleFileClear = useCallback(() => {
		setSelectedFile(null);
		fileInputRef.current.value = '';
	}, []);

	const renderFileLabel = () => (
		<div className='border border-gray-600 bg-gray-600 text-white inline px-2 py-1 rounded-md'>
			<FontAwesomeIcon icon={faFile} />
			<span> {selectedFile.name} </span>
			<FontAwesomeIcon
				className='text-rose-500 hover:cursor-pointer'
				icon={faTrashCan}
				onClick={handleFileClear}
			/>
		</div>
	);

	return (
		<div className='mt-4 flex flex-row items-center space-x-2 p-4 pt-0'>
			<label className='px-3 py-2 rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 hover:cursor-pointer transition-all duration-75'>
				<FontAwesomeIcon icon={faArrowUpFromBracket} />
				<input
					type='file'
					className='hidden'
					onChange={handleFileChange}
					ref={fileInputRef}
				/>
			</label>
			<div className='flex-grow h-full px-3 py-2 border border-gray-400 focus:border-gray-600 focus:shadow-md rounded-md bg-gray-100 placeholder-gray-400 text-black'>
				{selectedFile ? (
					renderFileLabel()
				) : (
					<input
						type='text'
						className='bg-transparent focus:outline-none w-full'
						placeholder='Type your message here'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				)}
			</div>
			<button
				className='px-3 py-2 rounded-md border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-75'
				onClick={handleSend}
			>
				Send
			</button>
		</div>
	);
};

export default RoomMessageInput;
