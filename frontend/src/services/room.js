import apiClient from './api';

const createRoom = async (name) => {
  try {
    const res = await apiClient.post(
      '/room/create',
      { name },
      {
        withCredentials: true,
      }
    );

    return res.data;
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

export { createRoom, getMyRooms };
