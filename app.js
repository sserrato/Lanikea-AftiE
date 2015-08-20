var morgan = require('morgan');
var express = require('express');
var	http = require('http');
var app = express();
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app); //setup for websocket application

// set up nTwitter with the api configuration in ./config.js
var io = require('socket.io')(server); //invokes socket.io which will handle all connections and responses using server.
var Twit = require('twit');
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

//----------------------------------------
/*
	Create an express webapp.  This will allow us to serve
	static files in the ./public directory
*/
app.use(express.static(__dirname + '/public'));
//========================================

// console.log(twitter);

server.listen(app.get('port'), function(){ //instead of app.listen because we are using websocket
console.log('Server started on: ', app.get('port'));
});


/*
	The streaming search parameters, info at:
		https://dev.twitter.com/docs/api/1.1/post/statuses/filter

	Examples:

	UK
		{locations:'-10.371,48.812,2.192,60.892'}

	San Francisco + New York
		{locations:'-122.75,36.8,-121.75,37.8,-74,40,-73,41'}

	Any Geotagged tweet
		{locations:'-180,-90,180,90'}

	Tweets mentioning pizza or burger
		{track:'pizza,burger'}

*/
// var stream = twitter.stream('statuses/filter', {locations:'-180,-90,180,90'}); //twitter is the variable declared above



/*
	Start the stream
*/

/*
	Output every tweet to the console
*/
// stream.on('data', function(data){
// 	console.log(data.text);
// });



/*
	When a tweet comes through with geodata, publish it to the
	browser over the /tweet channel
*/
var stream;
var searchTerm;
io.on('connect', function(socket){   //io.on is checking for someone to connect. socket is the person connected
  //UPDATE TERM EVENT
	socket.on('updateTerm', function(searchTerm){
    socket.emit('updatedTerm', searchTerm);
    //STOP STREAM AND START ANOTHER AFTER
    if(stream){
      console.log('stopped stream');
      stream.stop();
    }
    //CHECK THE INPUT BOX FOR VALUE
      stream = twitter.stream('statuses/filter', {track: searchTerm});
    //SEND THE DATA TO FRONT END
  	stream.on('tweet', function(tweet){ //this line and above are server side
  	  if(tweet.coordinates && tweet.coordinates.coordinates){
  			var data = {};
  			data.coordinates = tweet.coordinates.coordinates;
  			data.screen_name = tweet.user.screen_name;
  			data.text = tweet.text;
  			data.pic = tweet.user.profile_image_url;
  			socket.emit('tweets', data);  //sending info back to the client
  		}
      else if(tweet.place) {
  	  	var place = tweet.place.bounding_box.coordinates[0][0];
  			var data = {};
        data.coordinates = place;
      	data.screen_name = tweet.user.screen_name;
      	data.text = tweet.text;
      	data.pic = tweet.user.profile_image_url;
  			socket.emit('tweets', data);  //sending info back to the client
  	  }
  	});
  });
  //SETS UP TO SHOW ALL TWEETS
  socket.on('showAll', function(){
    socket.emit('showAll');
    //STOP STREAM AND START ANOTHER AFTER WITH ALL TWEETS
    if(stream){
      console.log('stopped stream');
      stream.stop();
    }
    //SETS IT SO MAP SHOWS ALL TWEETS AROUND THE WORLD
    stream = twitter.stream('statuses/filter', {locations:'-180,-90,180,90'});
    //SEND THE DATA TO FRONT END
    stream.on('tweet', function(tweet){ //this line and above are server side
      if(tweet.coordinates && tweet.coordinates.coordinates){
        var data = {};
        data.coordinates = tweet.coordinates.coordinates;
        data.screen_name = tweet.user.screen_name;
        data.text = tweet.text;
        data.pic = tweet.user.profile_image_url;
        socket.emit('tweets', data);  //sending info back to the client
      }
      else if(tweet.place) {
        var place = tweet.place.bounding_box.coordinates[0][0];
        var data = {};
        data.coordinates = place;
        data.screen_name = tweet.user.screen_name;
        data.text = tweet.text;
        data.pic = tweet.user.profile_image_url;
        socket.emit('tweets', data);  //sending info back to the client
      }
    });
  });
});
