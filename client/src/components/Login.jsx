import { useState } from 'react';
import { Paper, CardHeader, CardContent, TextField, Button, Alert } from '@mui/material';

import logo from '../assets/cthulhu.jpg';

const Login = (props) => {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');

  return (
    <Paper elevation={4} sx={{ mt: '0.5em' }}>
      <CardContent>
        <img style={{ width: '10%', maxWidth: '150px', maxHeight: '150px', borderRadius: '50%' }} src={logo} />
        <CardHeader title="Join a Room" />
        <TextField fullWidth label="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} sx={{ mb: '1em' }} />
        <TextField fullWidth label="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} sx={{ mb: '1em' }} />
        <Button fullWidth variant="contained" disabled={!roomName || !userName} onClick={() => props.joinRoom({ roomName, userName })}>
          Join Room
        </Button>
      </CardContent>
      {props.error && <Alert severity="error">{props.error}</Alert>}
    </Paper>
  );
};

export default Login;
