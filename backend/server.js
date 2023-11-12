const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(cors());


app.use(bodyParser.json());


app.use(
  session({
    secret: 'justinjustinjustin',
    resave: true,
    saveUninitialized: true
  })
);

mongoose.connect('mongodb://localhost:27017/kommunikationssystemDB');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database'));

const userRouter = require('./routes/userroute');
app.use('/users', userRouter);

app.listen(3005, () => console.log('Backend is running on port 3005'));
