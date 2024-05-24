import apiClient from './api';

const registerUser = async (username, email, password, preferredLanguage) => {
	try {
		const res = await apiClient.post(
			'/auth/register',
			{
				username,
				email,
				password,
				preferredLanguage,
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

const updateProfilePicture = async (profilePictureData) => {
	try {
		const res = await apiClient.post('/user/update-profile-picture', profilePictureData, {
			withCredentials: true,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return res.data.profilePicture;
	} catch (error) {
		console.error('Error updating profile picture:', error.response.data.msg);

		throw new Error(error.response.data.msg);
	}
};

const changePreferredLanguage = async (newPreferredLanguage) => {
	try {
		const res = await apiClient.post(
			'/user/change-preferred-language',
			{ newPreferredLanguage },
			{
				withCredentials: true,
			}
		);

		return res.data.newPreferredLanguage;
	} catch (error) {
		console.error('Error changing preferred language:', error.response.data.msg);

		throw new Error(error.response.data.msg);
	}
};

export { loginUser, registerUser, validateSession, updateProfilePicture, changePreferredLanguage };
