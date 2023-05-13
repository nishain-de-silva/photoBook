const jwt = require('jsonwebtoken')
module.exports = async function authenticate(req, res, next) {
    const jwtToken = req.headers["authorization"] || ""
    if(!jwtToken.length) {
        return res.status(401).json({
            message: "unauthorized access, provide token"
        })
    }
    jwt.verify(jwtToken, process.env.jwtSecret, (err, decodedData) => {
        if (err) return res.status(401).json({
            code: "TOKEN_EXPIRED",
            message: "unauthorized access, invalid token"
        })
        req.user = { id: decodedData.userId }
        next()
    })
}