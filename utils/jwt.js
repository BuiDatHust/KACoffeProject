const jwt = require('jsonwebtoken')

const generateAccessToken = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECERET, {
        expiresIn: process.env.JWT_LIFETIME
    })

    return token ;
}

const isToken = ({ token }) => jwt.verify(token, process.env.JWT_SECERET  );

const attachTokenToRes = ({ res, user }) =>{
    const token = generateAccessToken({ payload: user })

    res.cookie('token', token, {
        httpOnly: true ,
        expires: new Date(Date.now()+ 36000),
    })
}

module.exports = {
    generateAccessToken,
    isToken,
    attachTokenToRes
}

