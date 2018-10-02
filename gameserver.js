//importing

var app = require('express')();
var serveStatic = require('serve-static');
var http = require('http').Server(app);
var io = require('socket.io')(http);


//index stuff

app.use(serveStatic(__dirname + '/public'));

app.get('/player', function(req, res){
  res.sendFile(__dirname + '/playerindex.html');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/clientindex.html');
});

//declaring variables

var connections = 0;
var word = "";
var word_list = [];
var guessed_letters = [];
var number_wrong_guesses = 0;

//defining game functions

function initialiseGame(){
  word = "starwars"; // put word generator here
  word_list = [];
  for (c in word){
    word_list.push("_");
  }
  guessed_letters = [];
  number_wrong_guesses = 0;
  io.emit('changedwordlist', word_list);
  io.emit('updateimage', number_wrong_guesses);
}



function makeGuess(guess){
  if (word.split("").indexOf(guess) >= 0){
    console.log("guessed right");
    for(i = 0; i < word.length; i++ ){
      if(word[i] == guess){
        word_list[i] = guess;
      }
    }
    io.emit('changedwordlist', word_list);
    return true;
  }
  return false;
};



//socket stuff



io.on('connection', function(socket){
  if (connections == 0){
    initialiseGame();
  }
  else{
  io.emit('changedwordlist', word_list);io.emit('updateimage', number_wrong_guesses);
  io.emit('updateimage', number_wrong_guesses);
  }
  connections += 1;
  console.log(word_list);
  console.log('a user connected, total connected: ' + connections);

  socket.on('disconnect', function(){
    connections -= 1;
    console.log('user disconnected, total connected: ' + connections);
  });

  socket.on('guess', function(gue){
    console.log('guess:' + gue);
    if(!(makeGuess(gue))){
      number_wrong_guesses += 1
      console.log("wrong guess");
      io.emit('updateimage', number_wrong_guesses);
    }
  });


  socket.on('reset', function(){
    console.log("resetting");
    initialiseGame();
  });

});

http.listen(8000, function(){
  console.log('listening on *:8000');
});
