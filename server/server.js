import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import * as data from './data.js';

import * as colors from './colors.js';
import { time } from 'console';

// Reads PORT from the OS, the --env-file flag, or defaults to 9000
const PORT = process.env.PORT || 9000;

// The express server (configured, then passed to httpServer)
const app = express();

// Allows static hosting content of the public/ folder
// https://expressjs.com/en/api.html#express.static
app.use(express.static('public'));

// Parses incoming requests with JSON payloads
// https://expressjs.com/en/api.html#express.json
app.use(express.json());

// Custom application-level middleware for logging all requests
app.use((req, _res, next) => {
  const timestamp = new Date(Date.now());
  console.log(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
  console.log(req.method, req.hostname, req.path);
  console.log('headers:', req.headers);
  console.log('body:', req.body);
  next();
});

// Creating an httpServer using the express configuration
// https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const httpServer = http.createServer(app);

// New socket server
const io = new Server(httpServer, {});

io.on('connect', (socket) => {
  // Utility helper functions
  const emitUpdatedRoomData = (roomName) => {
    // Update the room details menu in App.jsx with the new user
    io.in(roomName)
      .fetchSockets()
      .then((socketsInRoom) => {
        const usersInRoom = socketsInRoom.map((s) => ({
          userName: s.data.userName,
          color: s.data.color,
        }));
        io.to(roomName).emit('update-room-users', usersInRoom); // Emit updated list
      });
  };

  // End Utility Helper Functions

  console.log('New connection', socket.id);

  // Client will have to emit "user:join" with joinInfo
  socket.on('join', (joinInfo) => {
    // The client has to be sending joinInfo in this format
    const { roomName, userName, timestamp } = joinInfo;

    if (data.isUserNameTaken(userName)) {
      joinInfo.error = `The name ${userName} is already taken`;
    } else {
      data.registerUser(userName);
      // Adding the generated color to the joinInfo object
      joinInfo.color = colors.getRandomColor();
      socket.data = joinInfo;
      socket.join(roomName);

      emitUpdatedRoomData(roomName);

      // edge case for when user joins when people are typing.
      // fetches typing users on join
      socket.emit('typing', data.getTypingUsers(roomName));

      socket.on('disconnect', () => {
        data.unregisterUser(userName);
        colors.releaseColor(socket.data.color);
        const disconnectTimestamp = Date.now();
        data.addMessage(roomName, { sender: '', text: `${userName} has left the room`, timestamp: disconnectTimestamp });
        io.to(roomName).emit('chat update', data.roomLog(roomName));
        emitUpdatedRoomData(roomName);

        // update users typing status on disconnect
        data.updateTypingStatus(roomName, userName, false);
        io.to(roomName).emit('typing', data.getTypingUsers(roomName));
      });

      // when a user joins, also include the time that they joined at
      data.addMessage(roomName, { sender: '', text: `${userName} has joined the room`, timestamp: timestamp });
      io.to(roomName).emit('chat update', data.roomLog(roomName));

      socket.on('message', ({ text }) => {
        const { roomName, userName, color } = socket.data;
        const timestamp = Date.now(); // ms since Jan 1, 1970
        const messageInfo = {
          sender: userName,
          text,
          color,
          timestamp,
        };
        console.log(roomName, messageInfo);
        data.addMessage(roomName, messageInfo);

        io.to(roomName).emit('chat update', data.roomLog(roomName));
      });

      socket.on('typing', (typingInfo) => {
        const { roomName, userName, isTyping } = typingInfo;
        data.updateTypingStatus(roomName, userName, isTyping);
        io.to(roomName).emit('typing', data.getTypingUsers(roomName));
      });

      /* Edit Message Event */
      socket.on('edit', ({ text }) => {
        /* Edge Cases */
        if (text.trim() === '') {
          console.log('Empty edit ignored');
          return;
        }

        if (socket.data.deleted) {
          console.log('Message deleted, cannot edit');
          return;
        }

        const { roomName, userName } = socket.data;
        const editedAt = Date.now(); // ms since Jan 1, 1970
        const messageInfo = {
          sender: userName,
          text,
          timestamp: editedAt,
          edited: true,
        };
        console.log(roomName, messageInfo);
        data.updateMessage(roomName, messageInfo);
        io.to(roomName).emit('edit', data.roomLog(roomName));
      });
    }

    console.log(joinInfo);
    socket.emit('join-response', joinInfo);
  });
});

// Socket event handling
// io.on('connect', (newClientSocket) => {
//   // Add new socket to the room
//   newClientSocket.join('lab-14');
//   console.log(`New connection established (id: ${newClientSocket.id})`);

//   // CUSTOM SERVER EVENTS
//   newClientSocket.on('broadcast to lab-14', (dataSentWithClientEmit) => {
//     newClientSocket.to('lab-14').emit('a lab-14 broadcast', `${newClientSocket.id} sent ${dataSentWithClientEmit}`);
//     // io.to("lab-14") would emit to everyone in the room, including the socket that sent the message
//     // socket.to(room) emits to everyone in the room, but excludes the socket who sent the message
//   });

//   newClientSocket.emit('a hello from the server', `hello ${newClientSocket.id}!`);

//   // Count how many sockets are currently in the room, then broadcast that total
//   // fetchSockets returns a Promise. Using then to resolve it
//   io.in('lab-14')
//     .fetchSockets()
//     .then((socketsInRoom) => {
//       io.to('lab-14').emit('room update', `There are ${socketsInRoom.length} sockets in lab-14`);
//     });
// });

// Start the server listening on PORT, then call the callback (second argument)
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
