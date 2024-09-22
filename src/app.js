require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const { User } = require('./models/user');
const url = process.env.MONGODB_URL;

// this is the middleware that will run for all the api request and this middleware reads the JSON file easily
app.use(express.json());

app.post('/signup', async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User added Successfully');
  } catch (error) {
    res.status(400).send('Error saving the user ' + error.message);
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
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
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
