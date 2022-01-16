const createTokenUser = (user) => {
    return { name: user.name, userId: user._id, role: user.role, score: user.score, rank: user.rank };
};

module.exports = createTokenUser;
