const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('build'));

let userCounter = 0;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('request user name', (callback) => {
    userCounter++;
    if (userCounter <= 2) {
      callback(`user${userCounter}`);
    } else {
      callback('Guest');
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
