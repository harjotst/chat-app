import React, { createContext, useState } from 'react';

import { updateProfilePicture, changePreferredLanguage } from '../services/user';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const updateUserProfilePicture = async (profilePicData) => {
		const profilePicture = await updateProfilePicture(profilePicData);

		setUser((prevUserData) => ({ ...prevUserData, profilePicture }));
	};

	const changeUserPreferredLanguage = async (newPreferredLanguage) => {
		const preferredLanguage = await changePreferredLanguage(newPreferredLanguage);

		setUser((prevUserData) => ({ ...prevUserData, preferredLanguage }));
	};

	const userContext = { user, setUser, updateUserProfilePicture, changeUserPreferredLanguage };

	return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
};
