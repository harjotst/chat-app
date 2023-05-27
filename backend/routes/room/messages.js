const express = require('express');

const router = express.Router();

const { Types } = require('mongoose');

const Room = require('../../models/Room');

const Activity = require('../../models/Activity');

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

    const isMember = room.members.some((member) => member.equals(userId));

    if (!isMember) {
      return res
        .status(403)
        .json({ msg: 'You must be a member of the room to view its messages' });
    }

    const messages = await Activity.find({ roomId })
      .populate({
        path: 'userId',
        select: '-password -rooms',
      })
      .skip(skipMessages)
      .limit(messagesPerPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// done & tested
router.post('/:roomId/messages', async (req, res) => {
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

    const message = new Activity({
      roomId,
      content,
      userId,
      contentType: 'message',
    });

    await message.save();

    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// done & tested
router.put('/:roomId/messages/:messageId', async (req, res) => {
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
      return res
        .status(403)
        .json({ msg: 'You can only edit your own messages' });
    }

    message.content = content;

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
      return res
        .status(403)
        .json({ msg: 'You are not authorized to delete this message' });
    }

    await message.deleteOne();

    res.status(200).json({ msg: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
