const express = require('express');
const { Types } = require('mongoose');
const router = express.Router();
const Room = require('../../models/Room');
const User = require('../../models/User');
const Activity = require('../../models/Activity');

const crypto = require('crypto');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send({ redirectUrl: '/login' });
  }
};

router.use(isAuthenticated);

const generateJoinCode = () => {
  return crypto.randomBytes(8).toString('hex');
};

// done && tested
router.post('/create', async (req, res) => {
  try {
    const userId = req.session.user.id;

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Room name is required' });
    }

    const room = new Room({
      name: name,
      createdBy: userId,
      members: [userId],
      joinCode: generateJoinCode(),
    });

    await room.save();

    const user = await User.findById(userId);

    user.rooms.push(room._id);

    await user.save();

    res.status(201).json({ msg: 'Room created', roomId: room._id });
  } catch (error) {
    console.error(error);

    res.status(500).json({ msg: 'Server error' });
  }
});

// done && tested
router.delete('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;

  if (!Types.ObjectId.isValid(roomId)) {
    return res.status(404).json({ msg: 'Invalid Object ID' });
  }

  const userId = req.session.user.id;

  const room = await Room.findById(roomId);

  if (!room) {
    return res.status(404).json({ msg: 'Room not found' });
  }

  if (room.createdBy.toString() !== userId) {
    return res
      .status(403)
      .json({ msg: 'You are not authorized to delete this room' });
  }

  await room.populate('members');

  for (const member of room.members) {
    member.rooms.pull(roomId);

    await member.save();
  }

  room.deleteOne();

  res.status(200).json({ msg: 'Room deleted successfully' });
});

// done && tested
router.put('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!Types.ObjectId.isValid(roomId)) {
      return res.status(404).json({ msg: 'Invalid Object ID' });
    }

    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ msg: 'New room name is required' });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    if (room.createdBy.toString() !== req.session.user.id) {
      return res
        .status(403)
        .json({ msg: 'Not authorized to update this room' });
    }

    if (room.name === newName) {
      return res.status(400).json({ msg: 'Cannot use same name' });
    }

    room.name = newName;

    await room.save();

    const renameActivity = new Activity({
      contentType: 'event',
      eventType: 'rename',
      userId: req.session.user.id,
      roomId: roomId,
    });

    await renameActivity.save();

    res.status(200).json({ msg: 'Room name updated successfully' });
  } catch (error) {
    console.error(error);

    res.status(500).json({ msg: 'Server error' });
  }
});

// done && tested
router.post('/:joinCode/join', async (req, res) => {
  const { joinCode } = req.params;

  const room = await Room.findOne({ joinCode });

  if (!room) {
    return res.status(404).json({ msg: 'Room not found' });
  }

  const userId = req.session.user.id;

  if (room.members.includes(userId)) {
    return res.status(400).json({ msg: 'User already joined the room' });
  }

  room.members.push(userId);

  await room.save();

  const user = await User.findById(userId);

  user.rooms.push(room._id);

  await user.save();

  // const joinActivity = new Activity({
  //   contentType: 'event',
  //   eventType: 'join',
  //   userId: userId,
  //   roomId: room._id,
  // });

  // await joinActivity.save();

  res
    .status(200)
    .json({ msg: 'Joined the room successfully', roomId: room._id });
});

// done && tested
router.put('/:roomId/update-join-code', async (req, res) => {
  const { roomId } = req.params;

  if (!Types.ObjectId.isValid(roomId)) {
    return res.status(404).json({ msg: 'Invalid Object ID' });
  }

  const userId = req.session.user.id;

  const room = await Room.findById(roomId);

  if (!room) {
    return res.status(404).json({ msg: 'Room not found' });
  }

  if (room.createdBy.toString() !== userId) {
    return res.status(403).json({
      msg: 'You are not authorized to update the join code for this room',
    });
  }

  room.joinCode = generateJoinCode();

  await room.save();

  res
    .status(200)
    .json({ msg: 'Join code updated successfully', joinCode: room.joinCode });
});

// done && tested
router.post('/:roomId/kick/:userId', async (req, res) => {
  try {
    const roomId = req.params.roomId;

    if (!Types.ObjectId.isValid(roomId)) {
      return res.status(404).json({ msg: 'Invalid Room Object ID' });
    }

    const targetUserId = req.params.userId;

    const currentUserId = req.session.user.id;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    if (room.createdBy.toString() !== currentUserId) {
      return res
        .status(403)
        .json({ msg: 'You are not authorized to kick users from this room' });
    }

    if (!Types.ObjectId.isValid(targetUserId)) {
      return res.status(404).json({ msg: 'Invalid User Object ID' });
    }

    if (!room.members.includes(targetUserId)) {
      return res.status(400).json({ msg: 'User is not a member of this room' });
    }

    room.members.pull(targetUserId);

    await room.save();

    const targetUser = await User.findById(targetUserId);

    targetUser.rooms.pull(roomId);

    await targetUser.save();

    const kickActivity = new Activity({
      contentType: 'event',
      eventType: 'kick',
      userId: targetUserId,
      roomId: roomId,
    });

    await kickActivity.save();

    res.status(200).json({ msg: 'User has been kicked out of the room' });
  } catch (error) {
    console.error(error);

    res.status(500).json({ msg: 'Server error' });
  }
});

// done && tested
router.post('/:roomId/leave', async (req, res) => {
  const { roomId } = req.params;

  if (!Types.ObjectId.isValid(roomId)) {
    return res.status(404).json({ msg: 'Invalid Object ID' });
  }

  const userId = req.session.user.id;

  const room = await Room.findById(roomId);

  if (!room) {
    return res.status(404).json({ msg: 'Room not found' });
  }

  if (!room.members.includes(userId)) {
    return res.status(400).json({ msg: 'You are not a member of this room' });
  }

  room.members.pull(userId);

  await room.save();

  const user = await User.findById(userId);

  user.rooms.pull(roomId);

  await user.save();

  const leaveActivity = new Activity({
    contentType: 'event',
    eventType: 'leave',
    userId: userId,
    roomId: roomId,
  });

  await leaveActivity.save();

  res.status(200).json({ msg: 'Left the room successfully' });
});

// done && tested
router.get('/my-rooms', async (req, res) => {
  try {
    const userId = req.session.user.id;

    const user = await User.findById(userId).populate({
      path: 'rooms',
      select: '-joinCode -members',
    });

    res.status(200).json({ rooms: user.rooms });
  } catch (error) {
    console.error(error);

    res.status(500).json({ msg: 'Server error' });
  }
});

// done && tested
router.get('/:roomId/users', async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!Types.ObjectId.isValid(roomId)) {
      return res.status(404).json({ msg: 'Invalid Object ID' });
    }

    const userId = req.session.user.id;

    const room = await Room.findById(roomId).populate({
      path: 'members',
      select: '-password -rooms -__v',
    });

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    const isMember = room.members.some((member) => member.equals(userId));

    if (!isMember) {
      return res
        .status(403)
        .json({ msg: 'You must be a member of the room to view its users' });
    }

    res.status(200).json({ users: room.members });
  } catch (error) {
    console.error(error);

    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
