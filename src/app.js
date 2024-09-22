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
    res.status(400).send('Error saving the user ', error.message);
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
