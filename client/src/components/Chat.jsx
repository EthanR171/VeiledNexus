import { useState, useEffect, useRef } from 'react';
import { Box, Paper, CardHeader, CardContent, Divider, Typography, TextField, Button, List, Stack, Drawer } from '@mui/material';

// https://date-fns.org/v4.1.0/docs/Getting-Started
import * as fns from 'date-fns';

import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const Chat = (props) => {
  /* Chat Log */

  const lastMessageRef = useRef(null);

  const renderMessage = (message, index) => {
    /* New Day Messages */

    if (message.newDay) {
      return (
        <div key={index} ref={lastMessageRef} style={{ marginBottom: '1em' }}>
          <Typography variant="h6" textAlign="center">
            <strong>{message.text}</strong>
          </Typography>
        </div>
      );
    }

    /* Timestamp */

    // This assumes message.timestamp is stored as Unix time
    // https://developer.mozilla.org/en-US/docs/Glossary/Unix_time
    const messageTimestamp = fns.format(message.timestamp, 'HH:mm');

    /* Meta Chat Messages */

    if (message.sender == '') {
      return (
        <div key={index} ref={lastMessageRef} style={{ marginTop: '1em', marginBottom: '1em' }}>
          <Typography variant="h6" textAlign="center">
            <i>{message.text}</i>
          </Typography>
          <Typography variant="body2" textAlign="center">
            <i>{messageTimestamp}</i>
          </Typography>
        </div>
      );
    }

    /* User Messages */

    const yourOwnMessage = message.sender == props.userName;
    const messageClassName = yourOwnMessage ? 'user-message' : 'message';

    return (
      <div key={index} ref={lastMessageRef} className={messageClassName}>
        <div className="message-bubble" style={{ borderColor: message.color }}>
          <Typography variant="h6" className="message-text" sx={{ color: message.color }}>
            <strong>{message.sender}</strong>
          </Typography>
          <Typography variant="h6" className="message-text">
            {message.text}
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'right' }}>
            <i>{messageTimestamp}</i>
          </Typography>
        </div>
      </div>
    );
  };

  /* Menu */

  const [menuOpen, setMenuOpen] = useState(false);

  const renderMenu = () => {
    // ...
  };

  const renderChatLog = () => {
    const chat = props.chatLog ?? [];
    const chatWithNewDayMessages = [];

    let lastMessage = null;
    chat.forEach((message) => {
      // Checking if there's no "previous message", start the chat with the Day Message
      // Or, if the day of the current message is different from the day of the previous message
      if (!lastMessage || fns.getDay(lastMessage.timestamp) != fns.getDay(message.timestamp)) {
        chatWithNewDayMessages.push({
          // Not a user-sent message
          sender: '',

          // Formatting the text to the "Friday, April 29th, 1453" format
          text: fns.format(message.timestamp, 'PPPP'),

          // A new property just being added here to *flag this as a special message*
          newDay: true,
        });
      }

      chatWithNewDayMessages.push(message);
      lastMessage = message;
    });

    return chatWithNewDayMessages.map(renderMessage);
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
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        {renderMenu()}
      </Drawer>

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: '1em',
          pr: '1em',
        }}
      >
        <Button variant="contained" onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </Button>
        <CardHeader title={props.roomName} />
        <Button variant="contained">
          <LogoutIcon />
        </Button>
      </Stack>
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
