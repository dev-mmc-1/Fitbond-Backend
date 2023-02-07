const mongoose = require('mongoose');
const { Schema } = mongoose;

const SportSchema = new Schema({
    name: { type: String },
    image: { type: String }
})

const Sports = mongoose.model('Sports', SportSchema);

module.exports = Sports;