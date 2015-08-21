require('dotenv').load()
var express     	= require('express');
var	http 		     	= require('http');
var logger 	    	=	require('morgan');
var bcrypt 	    	= require('bcrypt');
var TweetStream   = require('./models/tweet');
var User          = require('./models/user');
var usersController  = require('./controller/usersController');
var tweetsController = require('./controller/tweetsController');
var methodOverride  = require('method-override');
var Twit            = require('twit');
// authentication packages
var passport        = require('passport');
var flash           = require('connect-flash');
var session         = require('express-session')

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// set up mongoose and db-related
var mongoose = require('mongoose');
var mongodbUri = process.env.MONGODBURI
mongoose.connect(mongodbUri)
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once('connected. rejoice for we are connected at:' +mongodbUri, function(callback){console.log('connected to mongo')});
// set up bodyparser
var bodyParser = require('body-parser')

/*
	Create an express webapp.  This will allow us to serve
	static files in the ./public directory
*/
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
// use logger to show requests to the console
app.use(logger('dev'));
// parse incoming json
app.use(bodyParser.json());
// required for passport THURSDAY code
var wdi17p3session = process.env.WDI17P3SESSION
app.use(session({ secret: wdi17p3session}));; // session secret
app.use(passport.initialize());
app.use(passport.session()) // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

var server = require('http').createServer(app); //setup for websocket application

var io = require('socket.io')(server); //invokes socket.io which will handle all connections and responses using server.

//// ROUTES
// create an instance for the API routes
var apiRouter = express.Router();
	//console.log(apiRouter);

apiRouter.use(function(req, res, next){
	//console.log(req);
	next();
})

apiRouter.get('/', function(req,res){
	res.json({ message: 'Welcome to the API for CPS'});
})

//Sergio adding this / Creating routes for the tweet data API THURSDAY
apiRouter.route('/tweets')
  .get(tweetsController.showTweets)

apiRouter.route('/tweets/:queryTerm')
  .get(tweetsController.findQuery)

//END ADDING

apiRouter.route('/users')
	.post(usersController.createUser)
	.get(usersController.showUsers)

apiRouter.route('/users/:id')
	.get(usersController.findUser)
	.patch(usersController.editUser)
	.delete(usersController.deleteUser)

// REGISTER THE API ROUTE - all routes using the apiRouter will be prefied with /api
	app.use('/api', apiRouter);



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
// var filterParams = {locations:'-180,-90,180,90'}; // -10.371,48.812,2.192,60.892 UK
// var stream = twitter.stream('statuses/filter', {locations:'-180,-90,180,90'}); //twitter is the variable declared above


/*
	Start the stream
*/



/*
	Output every tweet to the console
*/
// stream.on('data', function(data){
// console.log(data);

// });

/*
	Create an express webapp.  This will allow us to serve
	static files in the ./public directory
*/
app.use(express.static(__dirname + '/public'));
/*
	When a tweet comes through with geodata, publish it to the
	browser over the /tweet channel
*/
var stream;
var searchTerm;

io.on('connect', function(socket){   //io.on is checking for someone to connect. socket is the person connected
  socket.on('updateTerm', function(searchTerm){
      socket.emit('updatedTerm', searchTerm);
      if(stream){
        console.log('stopped stream');
        stream.stop();
      }

//CHECK THE INPUT BOX FOR VALUE
  if(searchTerm !== ""){
    stream = twitter.stream('statuses/filter', {track: searchTerm});
    }

// SEND THE DATA TO THE FRONTEND
	stream.on('tweet', function(tweet){ //this line and above are server side

    if(tweet.coordinates && tweet.coordinates.coordinates){
			var data = {};
			data.coordinates = tweet.coordinates.coordinates;
			data.screen_name = tweet.user.screen_name;
			data.text = tweet.text;
			data.pic = tweet.user.profile_image_url;
			socket.emit('tweets', data);  //sending info back to the client
		} else if(tweet.place) {
	  	var place = tweet.place.bounding_box.coordinates[0][0];
			var data = {};
      data.coordinates = place;
    	data.screen_name = tweet.user.screen_name;
    	data.text = tweet.text;
    	data.pic = tweet.user.profile_image_url;
      // Sergio adding for model THURSDAY
      data.country = tweet.place.country;
      data.queryTerm = searchTerm;
      data.followersCount = tweet.user.followers_count;
      data.friendsCount = tweet.user.friends_count;
      data.listedCount = tweet.user.listed_count;
      data.screenName = tweet.user.screen_name;
      data.statusesCount = tweet.user.statuses_count;
      data.favouritesCount = tweet.user.favourites_count;
      var newTweet = new TweetStream(data)
      socket.emit('tweets', data);  //sending info back to the client
      newTweet.save(function(err){
        if(!err){
          console.log("success");
        }
      });
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
        data.followersCount = tweet.user.followers_count;
        data.text = tweet.text;
        data.pic = tweet.user.profile_image_url;
        socket.emit('tweets', data);  //sending info back to the client
      }
      else if(tweet.place) {
        var place = tweet.place.bounding_box.coordinates[0][0];
        var data = {};
        data.coordinates = place;
        data.followersCount = tweet.user.followers_count;
        data.screen_name = tweet.user.screen_name;
        data.text = tweet.text;
        data.pic = tweet.user.profile_image_url;
        socket.emit('tweets', data);  //sending info back to the client
      }
    });
  });
  //STOPS FEED
    socket.on('stopAll', function(){
      socket.emit('stopAll');
      stream.stop();
    });
});


server.listen(app.get('port'), function(){
	// console.log("Server started, port server is", app.get('port'));
	// console.log(app);
});
