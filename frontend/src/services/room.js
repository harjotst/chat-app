import apiClient from './api';

const joinRoom = async (joinCode) => {
  try {
    const res = await apiClient.post(`/room/${joinCode}/join`, null, {
      withCredentials: true,
    });

    return res.data.roomId;
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

    return res.data.roomId;
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

export { getMyRooms, createRoom, joinRoom };
