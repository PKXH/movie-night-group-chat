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

app.get('/', function(req, res) {
    res.render('index.ejs', {'port': port});
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
	socket.username = username;
	if (socket.username != null) {
	    io.emit('is_online', '🟢 <i>' + socket.username + ' joined the chat..</i>');
	}
    });

    socket.on('disconnect', function(username) {
	if (socket.username != null) {
	    io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
	}
    })

    socket.on('chat_message', function(message) {
	io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
});

const server = http.listen(port, function() {
    console.log('listening on *:', port);
});
