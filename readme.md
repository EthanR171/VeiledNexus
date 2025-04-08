# 👽 VeiledNexus

An interactive gallery featuring iconic scenes from my favorite anime series, built with React and Framer Motion. Each title reveals three carefully chosen scenes with dynamic animations and mouse-tracked motion effects.

A real-time full-duplex messaging application I created during my 5th Semester JavaScript Course. The final build of the application was then deployed to AWS using ElasticBeanstalk (see demo video).

---

## ✨ Technologies

- `React`
- `JavaScript`
- `WebSocket`
- `Material-UI (MUI)`
- `AWS`
- `CSS`
- `Vite`

---

## 🚀 Features

- Real Time Full-Duplex communication between clients
- Allows for multiple chat rooms with multiple users
- Provides users a menu with all active users in their current chat room
- Allows for most recent message to be edited or deleted using Slash Commands (See Demo)
- Gives users the option to leave a chat room via a "leave room" button
- Prevents duplicate users from joining the same room

## 📍The Process

I worked on this app throughout my INFO-3139 course in Labs spaced over the course of 4 months. The main objective of this project was to see how WebSockets differ from traditional HTTP requests. A large focus of creating VeiledNexus was constantly breaking code and debugging it to see why certain components work the way they do. One simple find, among numerous others, was that the unique identifier (id) of a Socket cannot be trusted to remain the same after disconnects. A simple fix was to provide each Socket with a meaningful and consistent identifer in its socket.data, which ended up being the username provided by each client.

## 🚦Running the Project

1. Clone the repository
2. Open two seperate terminal windows for client and server directories
3. Install dependencies in client and server: `npm install`
4. Start Client: `npm run dev`
5. Start Server: `npm run watch`
6. Open `http://localhost:5173` in your browser

## 🎞️ Preview

[▶️ Watch the demo](./video/VeiledNexus-Demo.mp4)
