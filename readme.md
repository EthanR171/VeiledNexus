# 👽 VeiledNexus

A real-time full-duplex messaging application. The final build of the application was then deployed to AWS using ElasticBeanstalk (see demo video).

## ✨ Technologies

- `React`
- `JavaScript`
- `WebSocket`
- `Material-UI (MUI)`
- `AWS`
- `CSS`
- `Vite`

## 🚀 Features

- Real Time Full-Duplex communication between clients
- Allows for multiple chat rooms with multiple users
- Provides users a menu with all active users in their current chat room
- Allows for most recent message to be edited or deleted using Slash Commands (See Demo)
- Gives users the option to leave a chat room via a "leave room" button
- Prevents duplicate users

## 📍The Process

I worked on VeiledNexus over the course of 1 month during my 5th semester JavaScript course. The main objective of this project was to see how WebSockets differ from traditional HTTP requests. A large focus of creating VeiledNexus was constantly breaking code and debugging it to see why certain components work the way they do. One simple find, among numerous others, was that the unique identifier (id) of a Socket cannot be trusted to remain the same after disconnects. A simple fix was to provide each Socket with a meaningful and consistent identifer in its socket.data, which ended up being the username along with room name provided by each client.

## 🚦Running the Project

1. Clone the repository
2. Open two seperate terminal windows for client and server directories
3. Install dependencies in client and server: `npm install`
4. Start Client: `npm run dev`
5. Start Server: `npm run watch`
6. Open `http://localhost:5173` in your browser

## 🎞️ Preview

https://github.com/user-attachments/assets/b616c6a9-0b22-4927-8e70-8690d91719df
