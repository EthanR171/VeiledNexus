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

const updateTypingStatus = (roomName, userName, isTyping) => {
  Room.get(roomName).updateTypingStatus(userName, isTyping);
};

const getTypingUsers = (roomName) => {
  return Array.from(Room.get(roomName).typingUsers);
};

export { registerUser, unregisterUser, isUserNameTaken, roomLog, addMessage, updateTypingStatus, getTypingUsers };
