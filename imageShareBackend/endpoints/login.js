const router = require('express').Router()
const { includeStringFields } = require('../utils')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bycrpt = require('bcrypt')

router.post('/', async (req, res) => {
    const { email, password } = req.body
    if(!includeStringFields(['email', 'password'], req.body)) {
        return res.json({
            success: false,
            message: 'Please provide email and password'
        })
    }
    
    const loginUser = await User.findOne({ email })
    
    if(!loginUser || !bycrpt.compareSync(password, loginUser.password))
        return res.json({
            success: false,
            message: 'Either email or password is incorrect'
        })

    const token = jwt.sign({
        userId: loginUser.id
    }, process.env.jwtSecret, { expiresIn: "2h" })

    return res.json({
        success: true,
        token
    })
})

module.exports = router
