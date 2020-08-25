// establish connection to our chat database and return a handle from it if successful

const mongoose = require("mongoose");
const url = "mongodb://localhost/chat";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });  

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to chat database \''+url+'\'');
    module.exports = db;
});
