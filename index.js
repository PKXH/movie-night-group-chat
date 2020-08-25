/* movie night group chat app */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { program } = require('commander');
program.version('1.0.0');

program
//  .option('-d, --debug', 'output extra debugging')
//  .option('-s, --small', 'small pizza size')
  .option('-p, --port <port>', 'listen for connection on specified port', 8080);

program.parse(process.argv);
var port = program.port;

// database connection
const Chat = require("./models/ChatSchema");
const dbconnect = require("./dbconnection");
const mongoose = require("mongoose");

// strip out the content that will be displayed to the user from the chat
// query results
//
function convert_query_results(data) {
    var msgs = []
    for (var i=0; i<data.length; i++) {
        var obj = { 'username':data[i].username, 'text':data[i].message };
        msgs.push(obj);	
    }
    return msgs;
}

// fetching initial chat messages from the database
//
// we will keep an updated version of the chat history globally available
// and update it whenever another chat is pushed into the database
// 
var history = []
var query = Chat.find({});
query.exec(function(err, msgs) {
    if (err) return console.error(err);
        history = convert_query_results(msgs);
    });

// This is called to render the webpage 
app.get('/', function(req, res) {
    res.render('index.ejs', {port: port, msgs: history}); 
});

// register websockets events
io.sockets.on('connection', function(socket) {

    socket.on('username', function(username) {
	socket.username = username;
	if (socket.username != null) {
	    io.emit('is_online', '💚 <i>' + socket.username + ' joined the chat.</i>');
	}
    });

    socket.on('disconnect', function(username) {
	if (socket.username != null) {
	    io.emit('is_online', '💔 <i>' + socket.username + ' left the chat.</i>');
	}
    })

    socket.on('chat_message', function(message) {
	io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);

        let chatMessage = new Chat({ message: message, username: socket.username });
        chatMessage.save(function (err, chatMessage) {
            if (err) return console.error(err);
//            console.log('wrote Chat(\'' + message + '\', \'' + socket.username + '\') to db');

            // we're just pushed a new chat message to the database, so let's update the
            // chat history log so new joiners will be able to pick up the whole conversation
	    //
            query = Chat.find({});
            query.exec(function(err, msgs) {
                if (err) return console.error(err);
                history = convert_query_results(msgs);
             });
        });
    });
});

// now that we're all set up, lets wait for a new connection
// 
const server = http.listen(port, function() {
    console.log('listening on *:', port);
});
