const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { includeStringFields } = require('../utils')

router.post('/', async (req, res) => {
    if(!includeStringFields(['name', 'email', 'password'], req.body)) {
        return res.json({
            success: false,
            message: "Mandatory fields are missing"
        })
    }
    const { name, email, password } = req.body
    
    if(await User.findOne({ email })) {
        return res.json({
            success: false,
            message: "User already exists with given email address" 
        })
    }
    const newUser = await new User({
        name,
        email,
        password: bcrypt.hashSync(password, 1)
    }).save()
    
    const token = jwt.sign({
        userId: newUser.id,
    }, process.env.jwtSecret, { expiresIn: "2h" })

    return res.json({
        success: true,
        message: "user registered successfully",
        token
    })
})

module.exports = router
