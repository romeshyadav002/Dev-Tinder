require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const { User } = require('./models/user');
const url = process.env.MONGODB_URL;
const { validateSignUpData } = require('./utils/validations');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

// this is the middleware that will run for all the api request and this middleware reads the JSON file easily
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    // encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User added Successfully');
  } catch (error) {
    res.status(400).send('Error saving the user ' + error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create a JWT token
      const token = await jwt.sign({ _id: user._id }, 'DEV@TINDER', {
        expiresIn: '1d',
      });
      // console.log({ token });

      // add the token to cookie and send the response back to the user
      res.cookie('token', token, {
        expires: new Date(Date.now()) + 12 * 3600000,
      });
      res.send('Login Successful');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Error saving the user ' + error.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send('Error ' + error.message);
  }
});

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send('request sent by ' + user.firstName);
  } catch (error) {
    res.status(400).send('Error ' + error.message);
  }
});

// GET user by email
app.get('/user', async (req, res) => {
  console.log(req.body);
  const userEmail = req.body.emailId;

  try {
    // to find only one document then use .findOne function
    const user = await User.find({ emailId: userEmail });
    if (!user || user.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send('Something went wrong ' + error);
  }
});

// Feed API :- GET /feed -get all the users from the database
app.get('/feed', async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send('Something went wrong ' + error);
  }
});

// Delete a user from the database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (error) {
    res.status(400).send('Something went wrong ' + error);
  }
});

// Update a user
app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      // 'userId',
      'photoUrl',
      'about',
      'gender',
      'age',
      'skills',
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error('Update not allowed');
    }
    if (data?.skills.length > 0) {
      throw new Error('Skills cannot be more than 10');
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'before',
      runValidators: true,
    });
    // console.log(user);
    res.send('user updated successfully');
  } catch (error) {
    res.status(400).send('Update failed ' + error);
  }
});

connectDB(url)
  .then(() => {
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('server is successfully listening on port 3000');
    });
  })
  .catch((e) => {
    console.log('Database connection failed', e);
  });
