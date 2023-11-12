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
router.get('/:id', getUsers , (req, res)=> {
    res.send(res.user)
})

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

//UPDATE USER BY ID
router.patch('/:id', getUsers, async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.eMail != null) {
        res.user.eMail = req.body.eMail;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// DELETE USER BY ID
router.delete('/:id', getUsers, async (req, res)=>{
    try{
        await User.deleteOne({ _id: req.params.id})
        res.json({message: "Deleted User"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

async function getUsers(req, res, next){
    let user
    try{
        user= await User.findById(req.params.id)
        if(user == null){
            return res.status(404).json({message:'Cannot find User'})
        }

    } catch(err){
        return res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}

module.exports = router