const CustomApi = require('../errors');

const Permission = (requestUser, resourceUserId) => {
    if (requestUser.role == 'admin') return;
    if (requestUser._id == resourceUserId.toString()) return;
    throw new CustomApi.UnauthorizedErr('Not authorize to access this route');
};

module.exports = Permission;
