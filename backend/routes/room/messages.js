const express = require('express');

const fs = require('fs');

const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const { Types } = require('mongoose');

const s3 = require('../../config/s3');

const Room = require('../../models/Room');

const User = require('../../models/User');

const Activity = require('../../models/Activity');

const config = require('../../config/config');

const upload = require('../../config/multer');

const { translateMessage } = require('../../utils/translate');

const isAuthenticated = (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).send({ redirectUrl: '/login' });
	}
};

router.use(isAuthenticated);

// done & tested
router.get('/:roomId/messages/:page', async (req, res) => {
	try {
		const { roomId, page } = req.params;

		if (!Types.ObjectId.isValid(roomId)) {
			return res.status(400).json({ msg: 'Invalid room ID' });
		}

		const messagesPerPage = 20;

		const skipMessages = (parseInt(page) - 1) * messagesPerPage;

		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ msg: 'Room not found' });
		}

		const userId = req.session.user.id;

		const user = await User.findById(userId);

		const isMember = room.members.some((member) => member.equals(userId));

		if (!isMember) {
			return res
				.status(403)
				.json({ msg: 'You must be a member of the room to view its messages' });
		}

		let activities = await Activity.find({ roomId })
			.populate({
				path: 'userId',
				select: '-password -rooms',
			})
			.skip(skipMessages)
			.limit(messagesPerPage)
			.sort({ createdAt: -1 });

		activities.reverse();

		for (let activity of activities) {
			if (activity.contentType === 'message') {
				const activityObject = activity.toObject();

				const translated =
					activity.messageInformation.language === user.preferredLanguage ||
					activity.messageInformation.translations.some(
						(translation) => translation.language === user.preferredLanguage
					);

				if (!translated) {
					const translatedMessage = await translateMessage(
						activity.messageInformation.message,
						activity.messageInformation.language,
						user.preferredLanguage
					);

					activity.messageInformation.translations.push({
						language: user.preferredLanguage,
						message: translatedMessage,
					});

					await activity.save();
				}

				activityObject.messageInformation.translation =
					activity.messageInformation.translations.find(
						(translation) => translation.language === user.preferredLanguage
					);

				activities[activities.indexOf(activity)] = activityObject;
			}
		}

		res.status(200).json({ messages: activities });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Server error', error });
	}
});

// done & tested
router.post('/:roomId/create-message', async (req, res) => {
	try {
		const { roomId } = req.params;

		const { content } = req.body;

		if (!Types.ObjectId.isValid(roomId)) {
			return res.status(400).json({ msg: 'Invalid room ID' });
		}

		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ msg: 'Room not found' });
		}

		const userId = req.session.user.id;

		const isMember = room.members.some((member) => member.equals(userId));

		if (!isMember) {
			return res
				.status(403)
				.json({ msg: 'You must be a member of the room to post a message' });
		}

		const user = await User.findById(userId);

		let languages = await room.populate({
			path: 'members',
			select: 'preferredLanguage -_id',
		});

		languages = [
			...new Set(languages.members.map((language) => language.preferredLanguage)),
		].filter((language) => language !== user.preferredLanguage);

		let translations;

		try {
			const translationPromise = languages.map(async (language) => {
				const translation = await translateMessage(
					content,
					user.preferredLanguage,
					language
				);
				return {
					message: translation,
					language,
				};
			});

			translations = await Promise.all(translationPromise);
		} catch (error) {
			res.status(500).json({ msg: error });
		}

		const message = new Activity({
			roomId,
			userId,
			messageInformation: {
				message: content,
				language: user.preferredLanguage,
				translations,
			},
			contentType: 'message',
		});

		await message.save();

		await message.populate({
			path: 'userId',
			select: '-password -rooms',
		});

		res.status(201).json({ message });
	} catch (error) {
		console.error(error);

		res.status(500).json({ msg: error });
	}
});

// done & tested
router.put('/:roomId/message/:messageId', async (req, res) => {
	try {
		const { roomId, messageId } = req.params;

		const { content } = req.body;

		const userId = req.session.user.id;

		if (!Types.ObjectId.isValid(roomId)) {
			return res.status(400).json({ msg: 'Invalid Room Object ID' });
		}

		if (!Types.ObjectId.isValid(messageId)) {
			return res.status(400).json({ msg: 'Invalid Message Object ID' });
		}

		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ msg: 'Room not found' });
		}

		if (!room.members.some((memberId) => memberId.equals(userId))) {
			return res
				.status(403)
				.json({ msg: 'You must be a member of the room to edit messages' });
		}

		const message = await Activity.findById(messageId);

		if (!message) {
			return res.status(404).json({ msg: 'Message not found' });
		}

		if (!message.userId.equals(userId)) {
			return res.status(403).json({ msg: 'You can only edit your own messages' });
		}

		message.messageInformation.message = content;

		await message.save();

		res.status(200).json({ message });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Server error' });
	}
});

// done & tested
router.delete('/:roomId/messages/:messageId', async (req, res) => {
	try {
		const { roomId, messageId } = req.params;

		const userId = req.session.user.id;

		if (!Types.ObjectId.isValid(roomId)) {
			return res.status(400).json({ msg: 'Invalid Room ID' });
		}

		if (!Types.ObjectId.isValid(messageId)) {
			return res.status(400).json({ msg: 'Invalid Message ID' });
		}

		const room = await Room.findById(roomId);

		if (!room) {
			return res.status(404).json({ msg: 'Room not found' });
		}

		if (!room.members.some((memberId) => memberId.equals(userId))) {
			return res
				.status(403)
				.json({ msg: 'You must be a member of the room to delete messages' });
		}

		const message = await Activity.findById(messageId);

		if (!message) {
			return res.status(404).json({ msg: 'Message not found' });
		}

		if (!message.userId.equals(userId)) {
			return res.status(403).json({ msg: 'You are not authorized to delete this message' });
		}

		await message.deleteOne();

		res.status(200).json({ msg: 'Message deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Server error' });
	}
});

// done & tested
router.post('/:roomId/uploadFile', upload.single('file'), async (req, res) => {
	const { roomId } = req.params;

	const userId = req.session.user.id;

	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		return res.status(400).send({ error: 'Invalid roomId' });
	}

	const room = await Room.findById(roomId);

	if (!room) {
		return res.status(404).send({ error: 'Room not found' });
	}

	if (!room.members.includes(userId)) {
		return res.status(403).send({ error: 'User is not a member of the room' });
	}

	const fileExtension = req.file.originalname.split('.').pop();

	const key = `rooms/${roomId}/${uuidv4()}.${fileExtension}`;

	const fileStream = fs.createReadStream(req.file.path);

	const params = {
		Bucket: config.AWS_PUBLIC_BUCKET,
		Key: key,
		Body: fileStream,
		ACL: 'public-read',
	};

	const data = await s3.upload(params).promise();

	fs.unlinkSync(req.file.path);

	const activity = new Activity({
		contentType: 'file',
		fileName: req.file.originalname,
		fileAddr: data.Location,
		userId,
		roomId,
	});

	await activity.save();

	await activity.populate({
		path: 'userId',
		select: '-password -rooms',
	});

	res.send({ message: 'File uploaded successfully', activity });
});

module.exports = router;
