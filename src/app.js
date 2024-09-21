const express = require('express');

const app = express();

// order of the routes will make a difference - it will try to match the route from top to bottom
// if you are using app.use() then it will match the routes string
// and if after `/` is there any thing it will still go that route only
// if you are using app.get() then it will match exactly to that string

app.get('/user', (req, res) => {
  res.send({ firstName: 'Romesh', lastName: 'Yadav' });
});

app.post('/user', (req, res) => {
  console.log(req.body);
  res.send('Data successfully saved to the database!');
});

app.delete('/user', (req, res) => {
  res.send('Deleted successfully');
});

app.use('/test', (req, res) => {
  res.send('hello from the test');
});

app.listen(3000, () => {
  console.log('server is successfully listening on port 3000');
});
