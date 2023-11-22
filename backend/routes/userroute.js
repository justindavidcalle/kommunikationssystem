const express = require('express')
const router = express.Router()
const User = require('../models/usermodel')
const bcrypt = require('bcrypt')


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
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
})

//UPDATE USER BY ID
router.patch('/:id', getUsers, async (req, res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
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

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Check if the entered password matches the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Set user information in the session
      req.session.user = { _id: user._id, username: user.username };
  
      res.json({ success: true, message: 'Login successful', token: username });
    } catch (error) {
      console.error('Login failed:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  })

module.exports = router