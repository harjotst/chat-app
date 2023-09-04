import apiClient from './api';

const registerUser = async (username, email, password) => {
  try {
    const res = await apiClient.post(
      '/auth/register',
      {
        username,
        email,
        password,
      },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    // console.error('Error signing up:', error.response.data.msg);

    throw new Error(error.response.data.msg);
  }
};

const loginUser = async (email, password) => {
  try {
    const res = await apiClient.post(
      '/auth/login',
      { email, password },
      { withCredentials: true }
    );

    return res.data;
  } catch (error) {
    // console.error('Error logging in:', error.response.data.msg);

    throw new Error(error.response.data.msg);
  }
};

const validateSession = async () => {
  try {
    const res = await apiClient.get('/auth/validate-session', {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    // console.error('Error logging in:', error.response.data.msg);

    throw new Error(error.response.data.msg);
  }
};

export { loginUser, registerUser, validateSession };
