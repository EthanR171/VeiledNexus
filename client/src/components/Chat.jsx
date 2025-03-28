import { useState, useEffect, useRef } from 'react';
import { Box, Paper, CardHeader, CardContent, Divider, Typography, TextField, Button, List } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';

const Chat = (props) => {
  /* Chat Log */

  const lastMessageRef = useRef(null);

  const renderChatLog = () => {
    const chat = props.chatLog ?? [];
    // we added a timestamp to the message being passed back in server.js on.('message') event.
    return chat.map((message, index) => (
      <div key={index} style={{ textAlign: 'center' }}>
        <Typography variant="h6">{`[${new Date(message.timestamp).toLocaleString()}]`}</Typography>
        <Typography
          ref={lastMessageRef}
          variant="h6"
          style={{
            textAlign: message.sender ? 'left' : 'center',
          }}
        >
          {message.sender ? `${message.sender}: ${message.text}` : `${message.text}`}
        </Typography>
      </div>
    ));
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.chatLog]);

  /* Send Message */

  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText) return;
    props.sendMessage(messageText);
    setMessageText('');
  };

  /* Render Component */

  return (
    <Paper elevation={4} sx={{ mt: '0.5em', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={`${props.roomName} (as ${props.userName})`} />
      <Divider />
      <CardContent>
        <List sx={{ height: '60vh', overflowY: 'scroll', textAlign: 'left' }}>{renderChatLog()}</List>
        <Divider />
        <Box sx={{ mt: '1em', display: 'flex', direction: 'row', flex: 1 }}>
          <TextField
            fullWidth
            sx={{ mr: '1em', flex: 9 }}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key == 'Enter' && handleSendMessage()}
          />
          <Button fullWidth variant="contained" sx={{ flex: 1 }} onClick={handleSendMessage}>
            <SendIcon />
          </Button>
        </Box>
      </CardContent>
    </Paper>
  );
};

export default Chat;
