const Chat = require('./models/chatmodel');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
  },
});

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: 'justinjustinjustin',
    resave: true,
    saveUninitialized: true,
  })
);

mongoose.connect('mongodb+srv://Justin:05strEEt20@kommunikationssystemclu.zk72crf.mongodb.net/');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database'));

const userRouter = require('./routes/userroute');
const chatRouter = require('./routes/chatroute');
app.use('/users', userRouter);
app.use('/chats', chatRouter);

io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on('sendMessage', async (data) => {
    try {
  
      const { fromUsername, toUsername, text } = data;
  
      if (!fromUsername || !toUsername || !text) {
        return socket.emit('error', { message: 'Invalid message data' });
      }
  
      const newChatMessage = new Chat({
        fromUsername,
        toUsername,
        text,
      });
  
      const savedChatMessage = await newChatMessage.save();
  
    } catch (error) {
      console.error('Error handling sendMessage:', error);
      socket.emit('error', { message: 'Server error' });
    }
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3005, () => console.log('Backend is running on port 3005'));
