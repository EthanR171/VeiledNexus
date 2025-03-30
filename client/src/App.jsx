import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

/* Material & UI Styling */
import { createTheme, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: green[700],
    },
  },
});

/* Components */
import Header from './components/Header';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  /* Login */

  const [joinInfo, setJoinInfo] = useState({
    userName: '',
    roomName: '',
    timestamp: '',
    error: '',
  });

  const hasJoined = () => joinInfo.userName && joinInfo.roomName && !joinInfo.error;

  // Updated to send a timestamp with join info
  const joinRoom = (joinData) => {
    // get current date timestamp
    var currentTimeUnix = Date.now(); // ms since Jan 1, 1970

    // create an object directly becasue setJoinInfo cant update fast enough before the emit is called. (ends up sending stale data)
    const joinDataWithTimestamp = {
      ...joinData,
      timestamp: currentTimeUnix,
    };

    // update state so when we can later pass it as a prop to Chat component
    setJoinInfo((prev) => ({
      ...prev,
      joinDataWithTimestamp,
    }));

    socket.current.emit('join', joinDataWithTimestamp);
  };

  /* Logout */

  const logout = () => {
    // emit a disconnect to server to free up the username and color
    socket.current.disconnect();

    // reset join info state
    setJoinInfo({
      userName: '',
      roomName: '',
      timestamp: '',
      error: '',
    });

    // reconnect again
    socket.current.connect();
  };

  /* Room Details Menu */
  const [roomUsers, setRoomUsers] = useState([]);

  /* Chat */

  const [chatLog, setChatLog] = useState([]);
  const sendMessage = (text) => {
    const timestamp = Date.now(); // ms since Jan 1, 1970
    socket.current.send({ text, timestamp }); // defaults to socket.emit("message")
  };

  /* WebSocket */

  // https://react.dev/reference/react/useRef
  // useRef is a React Hook that lets you reference a value that’s not needed for rendering
  const effectRan = useRef(false);
  const socket = useRef();

  const connectToServer = () => {
    if (effectRan.current) return; // Don't run twice with Strict Mode

    try {
      // Only use localhost:9000 if the app is being hosted on port 5173 (i.e. Vite)
      const wsServerAddress = window.location.port == 5173 ? 'localhost:9000' : '/';
      const ws = io.connect(wsServerAddress, { transports: ['websocket'] });

      // Handle join
      ws.on('join-response', setJoinInfo);

      ws.on('chat update', setChatLog);

      ws.on('update-room-users', setRoomUsers);

      socket.current = ws;
      effectRan.current = true; // Flag to prevent connecting twice
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    connectToServer();
  }, []);

  /* App Rendering */

  return (
    <ThemeProvider theme={theme}>
      <Header title="VeiledNexus© - Ethan Rivers" />
      {hasJoined() ? (
        <Chat {...joinInfo} sendMessage={sendMessage} chatLog={chatLog} roomUsers={roomUsers} logout={logout} />
      ) : (
        <Login joinRoom={joinRoom} error={joinInfo.error} />
      )}
    </ThemeProvider>
  );
}

export default App;
