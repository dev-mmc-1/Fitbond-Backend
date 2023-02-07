const mongoose = require('mongoose');
const { Schema } = mongoose;

const interestSchema = new Schema({
    sportsId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    level: { type: String },
})

const Interest = mongoose.model("Interest", interestSchema);

module.exports = Interest;