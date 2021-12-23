const UnauthentiatedError = require('../errors/badRequestError')
const UnauthorizedError = require('../errors/unthorizedError')
const { isToken } = require('../utils')

const authenticateUser = async(req, res, next) => {

    const token = req.signedCookies.token;
    console.log(token);

    if (!token) {
        throw new UnauthentiatedError("Authenticate Fail")
    }

    try {
        const { name, userId, role } = isToken({ token })
        req.user = { name, userId, role }
        next()
    } catch (error) {
        throw new UnauthentiatedError("Authenticate Fail")
    }
}

const attachUser = async(req, res, next) => {
    const token = req.signedCookies.token;
    if (!token) {
        next();
    } else {
        try {
            const { name, userId, role } = isToken({ token })
            req.user = { name, userId, role }
            next()
        } catch (error) {
            throw new UnauthentiatedError("Authenticate Fail")
        }
    }
}

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError(
                "Unauthrize to access"
            )
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermission,
    attachUser
}