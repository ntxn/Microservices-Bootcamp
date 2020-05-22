const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

// app.get('/posts', (req, res) => {
//   res.send(posts);
// });

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const newPost = { id, title: req.body.title };
  posts[id] = newPost;

  await axios.post('http://127.0.0.1:4005/events', {
    type: 'PostCreated',
    data: newPost,
  });

  res.status(201).send(newPost);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});

app.listen(4000, () => console.log('POSTS Server listening on port 4000'));
