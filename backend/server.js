const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/kommunikationssystemDB')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to Database'))

app.on('error', (error) => console.log(error))
app.once('open', () => console.log('connected to Database'))

app.use(express.json())

const userRouter = require('./routes/userroute')
app.use('/users', userRouter)

app.listen(3005, () => console.log('Backend is running on port 3005'))