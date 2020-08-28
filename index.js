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
  .option('-p, --port <port>', 'listen for connection on specified port', 8080)
  .option('-k, --key <stream key name>', 'endpoint stream key for connection web address', '');

program.parse(process.argv);
var port = program.port;
var key  = program.key;

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
	let safe_username = data[i].username !== undefined ? data[i].username : '<undefined>';
	let delim = safe_username.length>0 ? ':' : '';
        var obj = { 'username':(safe_username+delim), 'text':data[i].message };
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
app.get('/'+key, function(req, res) {
    res.render('index.ejs', {port: port, msgs: history}); 
});

function save_chat_message_to_db( username, text ) {
    let chatMessage = new Chat({ message: text, username: username });
    chatMessage.save(function (err, chatMessage) {
        if (err) return console.error(err);
//            console.log('wrote Chat(\'' + text + '\', \'' + socket.username + '\') to db');

        // we're just pushed a new chat message to the database, so let's update the
        // chat history log so new joiners will be able to pick up the whole conversation
        //
        query = Chat.find({});
        query.exec(function(err, msgs) {
            if (err) return console.error(err);
            history = convert_query_results(msgs);
         });
    });
}

// register websocket events
io.sockets.on('connection', function(socket) {

    // dispatch the chat message to clients and add it to the db chat history 
    function process_chat_message(username, text) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + text);
        save_chat_message_to_db(socket.username, text);
    };

    socket.on('username', function(username) {
	socket.username = username;
	if (socket.username != null) {
	    let join_msg = '💚 <i>' + socket.username + ' joined the chat.</i>';
	    io.emit('is_online', join_msg);
            save_chat_message_to_db('', join_msg);
	}
    });

    socket.on('disconnect', function(username) {
	if (socket.username != null) {
            let leave_msg = '💔 <i>' + socket.username + ' left the chat.</i>';
	    io.emit('is_online', leave_msg);
            save_chat_message_to_db('', leave_msg);
	}
    })

    socket.on('chat_message', function(message) {
        if (socket.username == null) {
            console.log('message from undefined username; re-establishing identity');
            io.emit('identity_check', message);
        } else {
            process_chat_message(socket.username, message);
	}
    });

    socket.on('id_chat_message', function(username, message) {
        socket.username = username;
        console.log ('user id re-established: ' + username);
        process_chat_message(username, message);
    });
});

// now that we're all set up, lets wait for a new connection
// 
const server = http.listen(port, function() {
    console.log('listening on *:', port);
});
