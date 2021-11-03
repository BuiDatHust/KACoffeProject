const user = require('../models/User')
class userController {
    index(req, res, next) {

        res.send("NguyenLT EDIT");
    }

    show(req, res) {
        res.send('NguyenLT11');
    }
}

module.exports = new userController();