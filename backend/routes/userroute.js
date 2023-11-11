const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')


//GET ALL
router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.json(users)
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//GET ID


//POST ONE
router.post('/', async (req,res) => {
    const users = new User({
        username: req.body.username,
        eMail: req.body.eMail,
        password: req.body.password
    })
    try{
        const newUser = await users.save()
        res.status(201).json(newUser)
    } catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router