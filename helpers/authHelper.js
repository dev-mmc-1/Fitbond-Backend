const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    createHash: (password) => {
        const hash = bcrypt.hashSync(password, 10, function (err, hash) {
            if (err) {
                console.log("Hashing", err)
                return
            }
            // Store hash in your password DB.
            return hash;
        });
        return hash;
    },
    authorizationMiddleWare: async (token) => {
        const decoded = jwt.verify(token, 'secretToken');
        const userData = await User.findOne({ email: decoded.email })
        return { user: userData };
    },
    forgotPassword: () => {

    }
}