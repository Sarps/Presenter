
var express = require('express'),
	app = express();

var io = require('socket.io').listen(app.listen(process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

var secret = 'sarpiro';

var presentation = io.on('connection', function (socket) {

	socket.on('load', function(data){
		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});
	});

	socket.on('slide-changed', function(data){
		if(data.key === secret) {			
			presentation.emit('navigate', {
				hash: data.hash
			});
		}
	});

});

console.log('Presenter is live and kicking');