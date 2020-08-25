const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    message:  { type: String },
    username: { type: String }},
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
