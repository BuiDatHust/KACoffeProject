const jwt = require('jsonwebtoken')

const generateAccessToken = ({ payload }) => {
    const token = jwt.sign(payload, 'jwtSecret', {
        expiresIn: '2d'
    })

    return token ;
}

const isToken = ({ token }) => jwt.verify(token, 'jwtSecret'  );

const attachTokenToRes = ({ res, user }) =>{
    const token = generateAccessToken({ payload: user })

    res.cookie('token', token, {
        httpOnly: true ,
        expires: new Date(Date.now()+ 360000),
        // secure: true,
        signed: true,
    })
}

module.exports = {
    generateAccessToken,
    isToken,
    attachTokenToRes
}

