import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

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
  console.log('New connection', socket.id);

  // Client will have to emit "user:join" with joinInfo
  socket.on('user:join', (joinInfo) => {
    console.log(joinInfo);
    // The client has to be sending joinInfo in this format
    const { roomName, userName } = joinInfo;

    // Using socket.data to keep track of the new client identifier: userName
    socket.data.userName = userName; // keep track of unique user identifier

    // Add the socket to the roomName room
    socket.join(roomName);

    // emit to the current user that they have joined the room (only emits to the socket who sent the message)
    socket.emit('user:joined', `${userName} has joined ${roomName}`);

    // emit to everyone else in the room that user has joined (emits to everyone in the room, but excludes the socket who sent the message)
    socket.to(roomName).emit('another-user:joined', `${userName} has joined ${roomName}`);
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
