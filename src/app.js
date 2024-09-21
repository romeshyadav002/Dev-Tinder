const express = require('express');
const {
  adminAuthMiddleWare,
  userAuthMiddleWare,
} = require('./middlewares/auth');

const app = express();

// handle Auth middleware for only GET, POST,etc requests
// this will run for all the request which contain `/admin' in it
app.use('/admin', adminAuthMiddleWare);

// you can use like this also if there are less no of request in which you want to check the particular middleware
app.get('/user', userAuthMiddleWare, (req, res) => {
  res.send('User data sent');
});

app.get('/admin/getAllData', (req, res) => {
  res.send('All data sent');
});

app.listen(3000, () => {
  console.log('server is successfully listening on port 3000');
});
