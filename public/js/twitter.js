$(function (){
  var socket = io();

  socket.on('connect', function() {
    console.log('Connected!');
  });

  socket.on('tweets', function(tweet) {
    // console.log(tweet);
    var html = '<div class="row"><div class="col-md-6 col-md-offset-3 tweet"><img src="' + tweet.pic + '" class="avatar pull-left"/><div class="names"><span class="username"><b>@' +tweet.screen_name + '</b></span></div><div class="contents"><span class="text">' + tweet.text + '</span></div></div></div>';
    $('#tweet-container').prepend(html);
  });

  $('form').submit(function(e){
    e.preventDefault();
    $('#tweet-container').empty();
    var search_term = $('input').val();
    if(search_term !== ""){
      socket.emit('updateTerm', search_term);
    } else {
      $('h1').text("Type a new keyword in the input field.");
    }
  });

  socket.on('updatedTerm', function(searchTerm) {
    $('h1').text("Twitter Search for "+ searchTerm);
    console.log(searchTerm);
  });

  //setting up the all tweets button
  $('#allTweets').on('click', function(){
    $('#tweet-container').empty();

    socket.emit('showAll');
  });

  socket.on('showAll', function() {
    $('h1').text("Twitter Search for all tweets");
    console.log("searching everything...");
  });

  //Setting up the remove tweets button
  $('#removeTweets').on('click', function(){
    $('#tweet-container').empty();
  });

  //Setting up the stop tweets button
  $('#stopTweets').on('click', function(){
    socket.emit('stopAll');
  });


});
