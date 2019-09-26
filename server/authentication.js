const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = async (req, res, next) => {
    let headers = req.headers['authorization']
    
    if(headers) {
        const token = headers.split(' ')[1]
        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded) {
            const username = decoded.username
            let userRecord = await models.User.findOne(
                {where:{username: username}}
            )
            if(userRecord) {
                next()
            } else {
                res.json({error: 'Invalid credentials'})
            }
        } else {
            res.json({error: 'Unathorized access'})
        }
    } else {
        res.json({error: 'Unauthorized access'})
    }

}

module.exports = authenticate