const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: false },
    fullName: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    gender: { type: String, required: false },
    newUser: { type: Boolean, required: false }
    // interest: { type: Array, required: false }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;