/*
 * movie night group chat app
 * author: PKXH
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { program } = require('commander');
program.version('1.0.0');

//
// process the command line arguments
//
program
  .option('-d, --debug_logging', 'output debug logging to console')
  .option('-p, --port <port>', 'listen for connection on specified port', 8080)
  .option('-k, --key <stream key name>', 'endpoint stream key for connection web address', '');
//
program.parse(process.argv);
var debug_logging_active = program.debug_logging;
var port = program.port;
var key  = program.key;

//
// database connection
//
const Chat = require("./models/ChatSchema");
const dbconnect = require("./dbconnection");
const mongoose = require("mongoose");

//
// print debug string if debug logging is enabled
//
function debug_log( msg ) {
    if (debug_logging_active) {
        console.log( 'debug: ' + msg );
    }
}

//
// strip out the content that will be displayed to the user from the chat
// query results
//
function convert_query_results( data ) {
    try {
        var msgs = []
        for (var i=0; i<data.length; i++) {
	    let safe_username = data[i].username !== undefined ? data[i].username : '<undefined>';
	    let delim = safe_username.length>0 ? ':' : '';
            var obj = { 'username':(safe_username+delim), 'text':data[i].message };
            msgs.push(obj);
        }
        return msgs;
    }
    catch(err) {
        console.log( 'error trying to extract safe username and text from data (' + err + ')' );
    }
}

//
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

//
// This is called to render the webpage 
//
app.get('/'+key, function(req, res) {
    try {
        res.render('index.ejs', {port: port, msgs: history});
    }
    catch(err) {
        console.log( 'error trying to render ejs file (' + err + ')' );
    }
});

//
// save the username and chat text to the database and update the globally-accessible
// chat history list so new users can load it up when they connect
//
function save_chat_message_to_db( username, text ) {
    try {
        let chatMessage = new Chat({ message: text, username: username });
        chatMessage.save(function (err, chatMessage) {
            if (err) return console.error(err);
	    // debug_log( 'wrote Chat(\'' + text + '\', \'' + socket.username + '\') to db' );

            //
            // we've just pushed a new chat message to the database, so let's update the
            // chat history log so new joiners will be able to pick up the whole conversation
            //
            query = Chat.find({});
            query.exec(function(err, msgs) {
                if (err) return console.error(err);
                history = convert_query_results(msgs);
             });
        });
    }
    catch(err) {
        console.log( 'error while trying to save chat message \'' + text + '\' from user ' + username + ' to the db: ' + err );
        throw(err)
    }
}

//
// register websocket events
//
io.sockets.on('connection', function(socket) {

    //
    // dispatch the chat message to clients and add it to the db chat history 
    //
    function process_chat_message(username, text) {
        try {
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + text);
            save_chat_message_to_db(socket.username, text);
        }
        catch(err) {
            console.log( 'error trying to post chat message (' + err + ')' );
	}
    };

    //
    // process user connection
    //
    socket.on('username', function(username) {
        try {
	    socket.username = username;
	    if (socket.username != null) {
	        let join_msg = '💚 <i>' + socket.username + ' joined the chat.</i>';
                debug_log(socket.username + ' joined the chat');
	        io.emit('is_online', join_msg);
                save_chat_message_to_db('', join_msg);
	    }
        }
        catch(err) {
            console.log( 'error trying to process connection for user ' + username + ' (' + err + ')' );
        }
    });

    //
    // process user disconnection
    //
    socket.on('disconnect', function(username) {
        try {
	    if (socket.username != null) {
                let leave_msg = '💔 <i>' + socket.username + ' left the chat.</i>';
                debug_log(socket.username + ' left the chat');
	        io.emit('is_online', leave_msg);
                save_chat_message_to_db('', leave_msg);
	    }
        }
        catch(err) {
            console.log( 'error trying to process disconnection for user ' + socket.username + ' (' + err + ')' );
        }
    })

    //
    // we've received a chat message; if the user id is missing, request resend-with-id from client;
    // otherwise process chat next normally
    //
    socket.on('chat_message', function(message) {
        try {
            if (socket.username == null) {
                debug_log( 'message from undefined username; re-establishing identity' );
                io.emit('identity_check', message);
            } else {
                process_chat_message(socket.username, message);
	    }
        }
        catch(err) {
            console.log( 'error trying to process incoming chat message from user ' + socket.username + ' (' + err + ')' );
        }
    });

    //
    // we've received a chat message identifying a null user; register their name and process their chat text
    //
    socket.on('id_chat_message', function(username, message) {
        try {
            socket.username = username;
            debug_log( 'user id re-established: ' + username );
            process_chat_message(username, message);
        }
        catch(err) {
            console.log( 'error processing identy re-establishment for user ' + username + ' (' + err + ')' );
        }
    });
});

//
// now that we're all set up, lets wait for a new connection
// 
const server = http.listen(port, function() {
    try {
        console.log('listening on *:', port);
    }
    catch(err) {
        console_log( 'error attempting to listen on port ' + port + ' (' + err + ')' );
    }
});
