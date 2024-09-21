const express = require('express');

const app = express();

app.get('/getUserData', (req, res) => {
  throw new Error('abc');
});

// we need to use this at last because in this whenever there is any error in above request than it will come in this code
app.use('/', (err, req, res, next) => {
  if (err) {
    res.status(500).send('Something went wrong');
  }
});
// use try catch block that is a proper way

app.listen(3000, () => {
  console.log('server is successfully listening on port 3000');
});
