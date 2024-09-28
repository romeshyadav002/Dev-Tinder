require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();
const url = process.env.MONGODB_URL;
const cors = require('cors');

// whitelist the domain name
const corsOption = { origin: 'http://localhost:5173', credentials: true };
app.use(cors(corsOption));
// this is the middleware that will run for all the api request and this middleware reads the JSON file easily
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

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
