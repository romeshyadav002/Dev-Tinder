const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const userRouter = express.Router();
const { User } = require('../models/user');

const USER_SAFE_DATA = 'firstName lastName age gender photoUrl about skills';

// Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA);
    // .populate('fromUserId', ['firstName', 'lastName']);
    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (err) {
    res.statusCode(400).send('ERROR: ' + err.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: 'Connections fetched successfully',
      data: data,
    });
  } catch (err) {
    res.statusCode(400).send('ERROR: ' + err.message);
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    // user should see all the cards except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.send(users);
  } catch (error) {
    res.statusCode(400).send('ERROR: ' + err.message);
  }
});

module.exports = userRouter;
