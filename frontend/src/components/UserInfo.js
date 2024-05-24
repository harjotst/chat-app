import React, { useState, useCallback } from 'react';

import PopUp from './PopUp';

import { useUser } from '../hooks/useUser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGear, faArrowUpFromBracket, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import languageShortForms from '../data/languages';

export default function UserInfo() {
	const { user, updateUserProfilePicture, changeUserPreferredLanguage } = useUser();

	const [popUpOpen, setPopUpOpen] = useState(false);

	const [selectedFile, setSelectedFile] = useState(null);

	const [newPreferredLang, setNewPreferredLang] = useState('');

	const closePopUp = () => {
		setSelectedFile(null);

		setNewPreferredLang('');

		setPopUpOpen(false);
	};

	const handleUpdateSettings = async () => {
		if (selectedFile) {
			const profilePicData = new FormData();

			profilePicData.append('profilePicture', selectedFile);

			await updateUserProfilePicture(profilePicData);
		}

		if (newPreferredLang !== '' && user.preferredLang !== newPreferredLang) {
			console.log(newPreferredLang);
			await changeUserPreferredLanguage(newPreferredLang);
		}

		closePopUp();
	};

	return (
		<>
			<div className='flex items-center justify-between border-t px-4 py-4'>
				<div className='flex items-center'>
					<div className='w-10 h-10 overflow-hidden inline-flex items-center justify-center mr-2'>
						<img
							src={user.profilePicture}
							className='rounded-full object-cover h-full w-full'
						/>
					</div>
					<div className='ml-4 font-medium'>{user.username}</div>
				</div>
				<button
					className='text-gray-500 hover:text-gray-600 pr-2'
					onClick={() => setPopUpOpen(true)}
				>
					<FontAwesomeIcon icon={faGear} className='text-xl' />
				</button>
			</div>
			<PopUp show={popUpOpen} close={closePopUp}>
				<div className='w-96'>
					<h1 className='text-2xl mb-4'>User Settings:</h1>
					<div className='flex flex-row items-center'>
						<p className='mr-2 flex-shrink-0 flex-grow-0 font-semibold'>
							Change Your Profile Picture:{' '}
						</p>
						<div className='flex items-center flex-grow overflow-hidden'>
							<label className='max-w-full items-center px-4 py-2 border border-gray-300 rounded cursor-pointer'>
								<div className='whitespace-nowrap overflow-hidden text-ellipsis'>
									<FontAwesomeIcon
										icon={faArrowUpFromBracket}
										className='text-base'
									/>
									<span className='ml-2 text-sm'>
										{selectedFile ? selectedFile.name : 'Upload'}
									</span>
									<input
										type='file'
										className='hidden'
										accept='image/png, image/jpeg'
										onChange={(event) => setSelectedFile(event.target.files[0])}
									/>
								</div>
							</label>
						</div>
					</div>
					<div className='flex flex-row items-center mt-6'>
						<p className='mr-2 flex-shrink-0 flex-grow-0 font-semibold'>
							Change Your Language:{' '}
						</p>
						<div className='relative px-2 py-2 border border-gray-300 rounded'>
							<select
								name='language'
								onChange={(e) => setNewPreferredLang(e.target.value)}
								className='appearance-none bg-transparent rounded pr-8'
							>
								<option value={null}>Preferred Language</option>
								{Object.entries(languageShortForms).map(([language, code]) => (
									<option key={code} value={code}>
										{language}
									</option>
								))}
							</select>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
								<FontAwesomeIcon icon={faChevronDown} />
							</div>
						</div>
					</div>
					<button
						className='block px-3 py-2 mt-5 bg-blue-500 text-white rounded-md ml-auto disabled:cursor-not-allowed disabled:bg-gray-700 transition-all duration-75'
						disabled={!selectedFile && !newPreferredLang}
						onClick={handleUpdateSettings}
					>
						Update Settings
					</button>
				</div>
			</PopUp>
		</>
	);
}
