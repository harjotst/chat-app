const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const User = require('../models/User');
const config = require('../config/config');
const upload = require('../config/multer');

const s3 = require('../config/s3');

const router = express.Router();

// done & tested
router.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
	const fileExtension = req.file.originalname.split('.').pop();
	const key = `users/${req.session.user.id}/${uuidv4()}.${fileExtension}`;
	const fileStream = fs.createReadStream(req.file.path);

	const params = {
		Bucket: config.AWS_PUBLIC_BUCKET,
		Key: key,
		Body: fileStream,
		ACL: 'public-read',
	};

	const data = await s3.upload(params).promise();

	fs.unlinkSync(req.file.path);

	if (data) {
		await User.findByIdAndUpdate(
			req.session.user.id,
			{ profilePicture: data.Location },
			{ new: true }
		);

		req.session.user.profilePicture = data.Location;

		res.status(200).json({ profilePicture: data.Location });
	}
});

router.post('/change-preferred-language', async (req, res) => {
	const { newPreferredLanguage } = req.body;

	if (req.session.user.preferredLanguage === newPreferredLanguage) {
		return res.status(400).json({
			message: 'Cannot change preferred language to already set preferred language.',
		});
	}

	const user = await User.findById(req.session.user.id);

	user.preferredLanguage = newPreferredLanguage;

	await user.save();

	req.session.user.preferredLanguage = newPreferredLanguage;

	res.status(201).json({ preferredLanguage: newPreferredLanguage });
});

module.exports = router;
