const express = require('express');
const { User } = require('../models/user');
const { validateSignUpData } = require('../utils/validations');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a JWT token
      // const token = await jwt.sign({ _id: user._id }, 'DEV@TINDER', {
      //   expiresIn: '1d',
      // });
      const token = await user.getJWT();
      // console.log({ token });

      // add the token to cookie and send the response back to the user
      res.cookie('token', token, {
        expires: new Date(Date.now() + 12 * 3600000),
      });
      res.send('Login Successful');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Error saving the user ' + error.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  try {
    // res.cookie('token', null, { expires: new Date(Date.now()) });
    res.clearCookie('token');
    res.send('Logout successful');
  } catch (error) {
    res.status(400).send('Error :- ' + error.message);
  }
});

module.exports = authRouter;
