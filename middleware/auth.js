const CustomErr = require('../errors');
const { isToken } = require('../utils');

const authenticateUser = async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        throw new CustomErr();
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomErr.UnauthorizedErr(
                'Unauthorized to access this routes'
            );
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };
