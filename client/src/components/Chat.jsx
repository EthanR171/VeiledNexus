import { useState, useEffect, useRef } from 'react';
import { Box, Paper, CardHeader, CardContent, Divider, Typography, TextField, Button, List } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';

// https://date-fns.org/v4.1.0/docs/Getting-Started
import * as fns from 'date-fns';

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

    /* Messages */

    return (
      <div key={index} ref={lastMessageRef}>
        {message.sender ? (
          <Typography variant="h6">{`${message.sender}: ${message.text}`}</Typography>
        ) : (
          <Typography variant="h6" textAlign="center">
            {message.text}
          </Typography>
        )}
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          <i>{messageTimestamp}</i>
        </Typography>
      </div>
    );
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
