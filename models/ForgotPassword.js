const mongoose = require('mongoose');
const { Schema } = mongoose;

const ForgotPasswordSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: false },
    otp: { type: Number, required: false },
    otpExpire: { type: Date, required: false },
    email: {type: String, required: false }
})

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

module.exports = ForgotPassword;