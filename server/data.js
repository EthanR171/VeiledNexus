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

  /* Ctor */
  constructor(name) {
    this.#name = name;
  }

  /* Instance Methods */
  addMessage(messageInfo) {
    messageInfo.timestamp = Date.now();
    this.#log.push(messageInfo);
  }

  /* Accessors */
  get name() {
    return this.#name;
  }

  get log() {
    return this.#log;
  }
}

/* Module methods */
const roomLog = (roomName) => {
  return Room.get(roomName).log;
};

const addMessage = (roomName, messageInfo) => {
  Room.get(roomName).addMessage(messageInfo);
};

export { registerUser, unregisterUser, isUserNameTaken, roomLog, addMessage };
