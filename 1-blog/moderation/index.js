const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.toLowerCase().includes('orange')
      ? 'rejected'
      : 'approved';

    await axios.post('http://127.0.0.1:4005/events', {
      type: 'CommentModerated',
      data: { ...data, status },
    });
  }

  res.send({});
});

app.listen(4003, () => console.log('MODERATION listening on port 4003'));
