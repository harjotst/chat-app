import React, { createContext, useState, useEffect, useRef } from 'react';

import { useUser } from '../hooks/useUser';

import { io } from 'socket.io-client';

import {
	createRoom,
	joinRoom,
	getMyRooms,
	getRoomMessagesByPage,
	sendMessageInRoom,
	sendFileInRoom,
	updateRoomCode,
	leaveRoom,
	kickUserFromRoom,
	getRoomMembers,
} from '../services/room';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const { user } = useUser();

	const [rooms, setRooms] = useState([]);

	const [roomsMessages, setRoomsMessages] = useState({});

	const [roomsNextPage, setRoomsNextPage] = useState({});

	const [currentRoom, setCurrentRoom] = useState(null);

	const [currentRoomMembers, setCurrentRoomMembers] = useState([]);

	const socketRef = useRef(null);

	useEffect(() => {
		if (!socketRef.current) {
			socketRef.current = io(process.env.REACT_APP_API_URL, { withCredentials: true });
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		const handleNewMessage = (newMessage) => {
			// console.log('Handle New Message');

			setRoomsMessages((prevRoomsMessages) => {
				const { roomId } = newMessage;

				newMessage.messageInformation.translation =
					newMessage.messageInformation.translations.find(
						(translation) => translation.language === user.preferredLanguage
					);

				delete newMessage.messageInformation.translations;

				const roomMessages = prevRoomsMessages[roomId] || [];

				return { ...prevRoomsMessages, [roomId]: [...roomMessages, newMessage] };
			});
		};

		const handleFileMessage = (newFile) => {
			// console.log('Handle File Message');

			setRoomsMessages((prevRoomsMessages) => {
				const roomMessages = prevRoomsMessages[newFile.roomId] || [];

				return { ...prevRoomsMessages, [newFile.roomId]: [...roomMessages, newFile] };
			});
		};

		const handleActivityMessage = async (newEvent) => {
			// console.log('Handle Activity Message');

			if (
				(newEvent.eventType === 'join' || newEvent.eventType === 'leave') &&
				newEvent.userId._id === user.id
			) {
				return;
			}

			if (newEvent.eventType === 'kick' && newEvent.userId._id === user.id) {
				setRooms(rooms.filter((room) => room._id !== newEvent.roomId));

				const { [currentRoom._id]: a, ...roomsMessagesLeft } = roomsMessages;

				setRoomsMessages(roomsMessagesLeft || {});

				const { [currentRoom._id]: b, ...roomsNextPageLeft } = roomsNextPage;

				setRoomsNextPage(roomsNextPageLeft || {});

				if (currentRoom._id === newEvent.roomId) {
					setCurrentRoom(null);
				}

				return;
			}

			setRoomsMessages((prevRoomsMessages) => {
				const roomMessages = prevRoomsMessages[newEvent.roomId] || [];

				return { ...prevRoomsMessages, [newEvent.roomId]: [...roomMessages, newEvent] };
			});

			await getCurrentRoomsMembers();
		};

		socketRef.current.on('message_activity', handleNewMessage);
		socketRef.current.on('file_activity', handleFileMessage);
		socketRef.current.on('event_activity', handleActivityMessage);

		return () => {
			socketRef.current.off('message_activity', handleNewMessage);
			socketRef.current.off('file_activity', handleFileMessage);
			socketRef.current.off('event_activity', handleActivityMessage);
		};
	}, [socketRef.current, user, currentRoom]);

	const NO_MORE_MESSAGES_LEFT = -1;

	useEffect(() => {
		if (user) {
			const fetchRoomsAndInitialMessages = async () => {
				let rooms;

				try {
					rooms = await getMyRooms();
				} catch (error) {
					console.error('Failed to get my rooms:', error);
				}

				setRooms(rooms);

				socketRef.current.emit(
					'join_rooms',
					rooms.map((room) => room._id)
				);

				for (const room of rooms) {
					await fetchInitialMessages(room._id);
				}
			};

			fetchRoomsAndInitialMessages();
		}
	}, [user]);

	const createNewRoom = async (newRoomName) => {
		try {
			const joinActivity = await createRoom(newRoomName);

			socketRef.current.emit('join_room', joinActivity.roomId);

			const rooms = await getMyRooms();

			await fetchInitialMessages(joinActivity.roomId);

			setRooms(rooms);

			socketRef.current.emit('event_activity', joinActivity, joinActivity.roomId);
		} catch (err) {
			console.error(err);
		}
	};

	const joinNewRoom = async (joinCode) => {
		try {
			const joinActivity = await joinRoom(joinCode);

			socketRef.current.emit('join_room', joinActivity.roomId);

			const rooms = await getMyRooms();

			await fetchInitialMessages(joinActivity.roomId);

			setRooms(rooms);

			socketRef.current.emit('event_activity', joinActivity, joinActivity.roomId);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchInitialMessages = async (roomId) => {
		try {
			const newMessages = await getRoomMessagesByPage(roomId, 1);

			setRoomsMessages((prevRoomsMessages) => ({
				...prevRoomsMessages,
				[roomId]: newMessages,
			}));

			const nextPage = newMessages.length > 0 ? 2 : NO_MORE_MESSAGES_LEFT;

			setRoomsNextPage((prevRoomsNextPage) => ({
				...prevRoomsNextPage,
				[roomId]: nextPage,
			}));
		} catch (error) {
			console.error('Failed to fetch initial messages:', error);
		}
	};

	const fetchMoreMessages = async (roomId) => {
		try {
			if (roomsNextPage[roomId] === NO_MORE_MESSAGES_LEFT) {
				return;
			}

			const moreMessages = await getRoomMessagesByPage(roomId, roomsNextPage[roomId]);

			if (moreMessages.length === 0) {
				return setRoomsNextPage((prevRoomsNextPage) => ({
					...prevRoomsNextPage,
					[roomId]: NO_MORE_MESSAGES_LEFT,
				}));
			}

			setRoomsMessages((prevRoomsMessages) => {
				const existingMessages = prevRoomsMessages[roomId] || [];

				return {
					...prevRoomsMessages,
					[roomId]: [...moreMessages, ...existingMessages],
				};
			});

			setRoomsNextPage((prevRoomsNextPage) => ({
				...prevRoomsNextPage,
				[roomId]: prevRoomsNextPage[roomId] + 1,
			}));
		} catch (error) {
			console.error('Failed to fetch more messages:', error);
		}
	};

	const sendMessage = async (roomId, content) => {
		try {
			const message = await sendMessageInRoom(roomId, content);

			socketRef.current.emit('message_activity', message, currentRoom._id);
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	const sendFile = async (roomId, fileContent) => {
		try {
			const activity = await sendFileInRoom(roomId, fileContent);

			socketRef.current.emit('file_activity', activity, currentRoom._id);
		} catch (error) {
			console.error('Failed to send file:', error);
		}
	};

	const resetCurrentRoomCode = async () => {
		const newJoinCode = await updateRoomCode(currentRoom._id);

		setCurrentRoom({ ...currentRoom, joinCode: newJoinCode });
	};

	const leaveCurrentRoom = async () => {
		const leaveActivity = await leaveRoom(currentRoom._id);

		setRooms(rooms.filter((room) => room._id !== currentRoom._id));

		const { [currentRoom._id]: a, ...roomsMessagesLeft } = roomsMessages;

		setRoomsMessages(roomsMessagesLeft || {});

		const { [currentRoom._id]: b, ...roomsNextPageLeft } = roomsNextPage;

		setRoomsNextPage(roomsNextPageLeft || {});

		setCurrentRoom(null);

		socketRef.current.emit('event_activity', leaveActivity, currentRoom._id);
	};

	const kickUserFromCurrentRoom = async (userId) => {
		const kickActivity = await kickUserFromRoom(userId, currentRoom._id);

		socketRef.current.emit('event_activity', kickActivity, currentRoom._id);
	};

	const getCurrentRoomsMembers = async () => {
		const updatedListOfRoomMembers = await getRoomMembers(currentRoom._id);

		setCurrentRoomMembers(updatedListOfRoomMembers);
	};

	const contextValue = {
		rooms,
		messages: roomsMessages,
		currentRoom,
		currentRoomMembers,
		setRooms,
		setCurrentRoom,
		createNewRoom,
		joinNewRoom,
		fetchInitialMessages,
		fetchMoreMessages,
		sendMessage,
		sendFile,
		resetCurrentRoomCode,
		leaveCurrentRoom,
		kickUserFromCurrentRoom,
		getCurrentRoomsMembers,
	};

	return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
