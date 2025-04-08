let users = new Set();

const registerUser = (userName) => {
  users.add(userName);
  console.log(`User registered: ${userName}`);
};

const unregisterUser = (userName) => {
  users.delete(userName);
  console.log(`User removed: ${userName}`);
};

const isUserNameTaken = (userName) => {
  return users.has(userName);
};

// Message Tracking

class Room {
  static #rooms = {};

  static get(roomName) {
    if (!Room.#rooms[roomName]) {
      Room.#rooms[roomName] = new Room(roomName);
    }
    return this.#rooms[roomName];
  }

  #name = '';
  #log = [];
  #typingUsers = new Set();

  /* Ctor */
  constructor(name) {
    this.#name = name;
  }

  /* Instance Methods */
  addMessage(messageInfo) {
    messageInfo.timestamp = Date.now();
    this.#log.push(messageInfo);
  }

  updateTypingStatus(userName, isTyping) {
    if (isTyping) {
      this.#typingUsers.add(userName);
    } else {
      this.#typingUsers.delete(userName);
    }
  }

  updateMessage(messageInfo) {
    const messageIndex = this.#log.findLastIndex((message) => message.sender === messageInfo.sender);

    if (messageIndex === -1) {
      console.log(`Message not found for user. Generating new Message: ${messageInfo.sender}`);
      const correctedMessageInfo = { ...messageInfo, edited: false }; // treat the message as brand new instead of edited
      this.addMessage(correctedMessageInfo);
      return;
    }

    if (this.#log[messageIndex].text === messageInfo.text) {
      console.log(`Edited message is the same: \nEdited: ${messageInfo.text} \nPrevious: ${this.#log[messageIndex].text}`);
      return;
    }

    this.#log[messageIndex].text = messageInfo.text;
    this.#log[messageIndex].timestamp = messageInfo.timestamp;
    this.#log[messageIndex].edited = messageInfo.edited;
  }

  /* Accessors */
  get name() {
    return this.#name;
  }

  get log() {
    return this.#log;
  }

  get typingUsers() {
    return this.#typingUsers;
  }
}

/* Data Module Interface */
const roomLog = (roomName) => {
  return Room.get(roomName).log;
};

const addMessage = (roomName, messageInfo) => {
  Room.get(roomName).addMessage(messageInfo);
};

const updateMessage = (roomName, messageInfo) => {
  Room.get(roomName).updateMessage(messageInfo);
};

const updateTypingStatus = (roomName, userName, isTyping) => {
  Room.get(roomName).updateTypingStatus(userName, isTyping);
};

const getTypingUsers = (roomName) => {
  return Array.from(Room.get(roomName).typingUsers);
};

export { registerUser, unregisterUser, isUserNameTaken, roomLog, addMessage, updateTypingStatus, getTypingUsers, updateMessage };
