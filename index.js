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

console.log("port: ", port);

// database connection
const Chat = require("./models/ChatSchema");
const dbconnect = require("./dbconnection");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");



//const bodyParser = require("body-parser");
//const chatRouter = require("./route/chatroute");

// bodyparser middleware
//app.use(bodyParser.json());

// routes
//app.use("/chats", chatRouter);

function convert_query_results(data) {
    var msgs = []
    for (var i=0; i<data.length; i++) {
        console.log(i);
        var obj = { 'username':data[i].username, 'text':data[i].message };
        msgs.push(obj);	
    }
    return msgs;
}

// fetching initial chat messages from the database
console.log("chat loads here");
var global_var = "this is global var 1"
var history = []
//try{
        var query = Chat.find({});
//}
//catch (err){
//	console.error(err);
//}

        query.exec(function(err, msgs) {
            if (err) return console.error(err);
//            app.get('/', function(req, res) {
		history = convert_query_results(msgs);
		//console.log(history);
		//var ser = JSON.stringify(history);
		//console.log("ser: " + ser);
//                res.render('index.ejs', {port: port, msgs: history}); //ser});
//		console.log(global_var);
	    });
			    
	    //console.log(msgs);
//	});

        app.get('/', function(req, res) {
            res.render('index.ejs', {port: port, msgs: history}); 
	});


//app.get('/', function(req, res) {
//    res.render('index.ejs', {'port': port, 'msgs': msgs});
//});



io.sockets.on('connection', function(socket) {

// *** Ok, I think somehow we're going to have to get the chat query to reload when a new user comes on? ***

//    socket.on('is_online', function(username) {
//         console.log("someone is online");
////    $('#messages').append($('<li>').html(username));
// //    window.scroll(0, document.documentElement.offsetHeight);
//    });

console.log("on connection...");

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

//        const Chat = require("./models/ChatSchema");
//        const mongoose = require("mongoose");
//        mongoose.Promise = require("bluebird");
//        const url = "mongodb://localhost/chat";
    
//        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });  
//        const db = mongoose.connection;
//        db.on('error', console.error.bind(console, 'connection error:'));
//        db.once('open', function() {
//            console.log('connected to chat database \''+url+'\'');
            let chatMessage = new Chat({ message: message, username: socket.username });
            chatMessage.save(function (err, chatMessage) {
                if (err) return console.error(err);
                console.log('wrote Chat(\'' + message + '\', \'' + socket.username + '\') to db');

global_var = "this is global var 2";
try {
            query = Chat.find({});
            query.exec(function(err, msgs) {
                if (err) return console.error(err);
//		console.log("query: " + msgs);
                history = convert_query_results(msgs);
		console.log("hist update: " + history);

//                app.get('/', function(req, res) {
//    		    let history = convert_query_results(msgs);
//		    console.log("hist: " + history);
//                    res.render('index.ejs', {port: port, msgs: history});
//    	        });
             });
}
catch(err)
{
return console.error(err);
}



    	    });

    	//});




//    	db.close();
//        });

	    //	const mongoose2 = require("mongoose");
	    //        mongoose2.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });  
	    //        const db2 = mongoose2.connection;
	    //        db2.on('error', console.error.bind(console, 'connection error:'));
	    //        db2.once('open', function() {
	    //            console.log('reconnected to chat database \''+url+'\'');
	    //            Chat.find({}, function(results){
	    //                console.log('query returned: ' + results);
	    //            }); 
	    //	db2.close();
	    //        });

//        dbconnect.then(db => {
//	//dbconnect.db.once('open', function() {
//            let chatMessage = new Chat({ message: message, sender: socket.username });
//            chatMessage.save(function (err, chatMessage) {
//	        if (err) return console.error(err);
//	        console.log('wrote Chat(\'' + message + '\', \'' + socket.username + '\') to db');
//	    });
//        });
//        },
//	err => { console.log('failed to write Chat(\'' + this.message + '\', \'' + this.socket.username + '\') to db');
//        });
    });
});

const server = http.listen(port, function() {
    console.log('listening on *:', port);
});
