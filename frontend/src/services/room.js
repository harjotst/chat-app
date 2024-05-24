import apiClient from './api';

const joinRoom = async (joinCode) => {
	try {
		const res = await apiClient.post(`/room/${joinCode}/join`, null, {
			withCredentials: true,
		});

		return res.data.activity;
	} catch (error) {
		throw new Error(error.response.data.msg);
	}
};

const createRoom = async (name) => {
	try {
		const res = await apiClient.post(
			'/room/create',
			{ name },
			{
				withCredentials: true,
			}
		);

		return res.data.activity;
	} catch (error) {
		throw new Error(error.response.data.msg);
	}
};

const getMyRooms = async () => {
	try {
		const res = await apiClient.get('/room/my-rooms', {
			withCredentials: true,
		});

		return res.data.rooms;
	} catch (error) {
		throw new Error(error.response.data.msg);
	}
};

const getRoomMembers = async (roomId) => {
	try {
		const res = await apiClient.get(`room/${roomId}/members`, {
			withCredentials: true,
		});

		return res.data.members;
	} catch (error) {
		throw new Error(error.response.data.msg);
	}
};

const getRoomMessagesByPage = async (roomId, page) => {
	try {
		const res = await apiClient.get(`/room/${roomId}/messages/${page}`, {
			withCredentials: true,
		});

		return res.data.messages;
	} catch (error) {
		throw new Error();
	}
};

const sendMessageInRoom = async (roomId, content) => {
	try {
		const messageResponse = await apiClient.post(
			`/room/${roomId}/create-message`,
			{ content },
			{
				withCredentials: true,
			}
		);

		return messageResponse.data.message;
	} catch (error) {
		throw error;
	}
};

const sendFileInRoom = async (roomId, fileContent) => {
	try {
		const fileResponse = await apiClient.post(`/room/${roomId}/uploadFile`, fileContent, {
			withCredentials: true,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return fileResponse.data.activity;
	} catch (error) {
		throw error;
	}
};

const leaveRoom = async (roomId) => {
	try {
		const leaveResponse = await apiClient.post(`/room/${roomId}/leave`);

		return leaveResponse.data.activity;
	} catch (error) {
		throw error;
	}
};

const updateRoomCode = async (roomId) => {
	try {
		const updatedJoinCodeResponse = await apiClient.put(`/room/${roomId}/update-join-code`);

		return updatedJoinCodeResponse.data.joinCode;
	} catch (error) {
		throw error;
	}
};

const kickUserFromRoom = async (userId, roomId) => {
	try {
		const kickResponse = await apiClient.post(`/room/${roomId}/kick/${userId}`);

		return kickResponse.data.activity;
	} catch (error) {
		throw error;
	}
};

export {
	createRoom,
	joinRoom,
	getMyRooms,
	getRoomMembers,
	getRoomMessagesByPage,
	sendMessageInRoom,
	sendFileInRoom,
	leaveRoom,
	updateRoomCode,
	kickUserFromRoom,
};
