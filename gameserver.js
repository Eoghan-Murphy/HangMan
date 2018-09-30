var app = require('express')();
var serveStatic = require('serve-static');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connections = 0;
var number_wrong_guesses = 0;

app.use(serveStatic(__dirname + '/public'));

app.get('/player', function(req, res){
  res.sendFile(__dirname + '/playerindex.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/clientindex.html');
});



io.on('connection', function(socket){

  connections += 1;
  console.log('a user connected, total connected: ' + connections);

  socket.on('disconnect', function(){
    connections -= 1;
    console.log('user disconnected, total connected: ' + connections);
  });

  socket.on('guess', function(gue){
    console.log('guess:' + gue);
    number_wrong_guesses += 1
    io.emit('guessed', {'guess': gue, 'wg' : number_wrong_guesses});
  });


});

http.listen(8000, function(){
  console.log('listening on *:8000');
});
