const express = require('express');

const app = express();

// order of the routes will make a difference - it will try to match the route from top to bottom
// if you are using app.use() then it will match the routes string
// and if after `/` is there any thing it will still go that route only
// if you are using app.get() then it will match exactly to that string

// ab?c: Matches ac or abc (zero or one b).
// ab+c: Matches abc, abbc, abbbc, etc. (one or more bs).
// ab*c: Matches ac, abc, abbc, etc. (zero or more bs or any thing between).
// a(bc)?d: Means bc is optional === ad or abcd

// user?userId=101 => means you are sending something in query
//    you can use it as req.query

// Dynamic params (colon :)
// user/101
// user/:userId => means you are sending something in params
//    you can use it as req.params

app.get('/user', (req, res) => {
  res.send({ firstName: 'Romesh', lastName: 'Yadav' });
});

app.listen(3000, () => {
  console.log('server is successfully listening on port 3000');
});
