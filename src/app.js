const express = require('express');

const app = express();

app.use(
  '/user',
  (req, res, next) => {
    // this function is called route handler
    // we need to send response otherwise it will stuck in infinite loop
    console.log('Handling the route handler');
    // res.send('Response !!');
    // if there is no response is send and not using next() function than again it will stuck into the loop
    // if we use next() without sending the res.send() from this than it will call the next route handler
    // if we use next() with res.send() than res will be send from 1st route handler which is written first and the log will print from both 1st and 2nd
    // but we will get an error `Cannot set headers after they are sent to the client` basically we can not resend the response
    next();
    // res.send('Response !!');
  },
  (req, res) => {
    // we can send multiple route handlers
    console.log('Handling the route handler 2!!');
    res.send('2nd Response !!');
  },
  // there should be res.send in the last route handler and there should not be next() function call in last handler
);

app.listen(3000, () => {
  console.log('server is successfully listening on port 3000');
});
