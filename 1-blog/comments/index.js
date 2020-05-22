const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = commentsByPostId[id] || [];

  const newComment = {
    id: randomBytes(4).toString('hex'),
    content: req.body.content,
  };
  comments.push(newComment);
  commentsByPostId[id] = comments;

  res.status(201).send(newComment);
});

app.listen(4001, () => console.log('Comments Server listening on port 4001'));
