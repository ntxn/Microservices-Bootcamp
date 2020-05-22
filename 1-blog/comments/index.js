const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

const commentsByPostId = {};

// app.get('/posts/:id/comments', (req, res) => {
//   res.send(commentsByPostId[req.params.id] || []);
// });

app.post('/posts/:id/comments', async (req, res) => {
  const { id: postId } = req.params;
  const comments = commentsByPostId[postId] || [];

  const newComment = {
    id: randomBytes(4).toString('hex'),
    content: req.body.content,
    status: 'pending',
  };
  comments.push(newComment);
  commentsByPostId[postId] = comments;

  await axios.post('http://127.0.0.1:4005/events', {
    type: 'CommentCreated',
    data: { ...newComment, postId },
  });

  res.status(201).send(newComment);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { postId, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post('http://127.0.0.1:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId },
    });
  }
  res.send({});
});

app.listen(4001, () => console.log('COMMENTS Server listening on port 4001'));
