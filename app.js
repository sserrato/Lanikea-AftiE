require('dotenv').load()
var ntwitter 	= require('ntwitter');
var express 	= require('express');
var	faye	 		= require('faye');
var	http 			= require('http');
var logger 		=	require('morgan');
var bcrypt 		= require('bcrypt');
var User      = require('./models/user');
var usersController = require('./controller/usersController');
var methodOverride = require('method-override');

// set up mongoose and db-related
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/cpsdb');
// mongoose.connect('mongodb://'<dbuser>':<dbpassword>@ds033113.mongolab.com:33113/heroku_c39vv1nx')
var mongodbUri = 'mongodb://cpsappuser2:cpsappuser2password@ds033113.mongolab.com:33113/cpsapp'
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

//// ROUTES
// create an instance for the API routes
var apiRouter = express.Router();
	console.log(apiRouter);

apiRouter.use(function(req, res, next){
	console.log(req);
	next();
})

apiRouter.get('/', function(req,res){
	res.json({ message: 'Welcome to the API for CPS'});
})

apiRouter.route('/users')
	.post(usersController.createUser)
	.get(usersController.showUsers)

apiRouter.route('/users/:id')
	.get(usersController.findUser)
	.patch(usersController.editUser)
	.delete(usersController.deleteUser)

// REGISTER THE API ROUTE - all routes using the apiRouter will be prefied with /api
	app.use('/api', apiRouter);

// set up nTwitter with the api configuration in ./config.js

var config = require('./config.js'),
	twit = new ntwitter(config);


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
var filterParams = {locations:'-180,-90,180,90'}; // -10.371,48.812,2.192,60.892 UK



/*
	Start the stream
*/
var stream;
twit.stream('statuses/filter', filterParams, function(_stream) {
	// usually, you'd access `stream` within the callback context, but
	// for the sake of readability later on - we're relying on the callback
	// being called syncronously (which nTwitter does) and will add
	// the callbacks further down
	stream = _stream;
});


/*
	Output every tweet to the console
*/
stream.on('data', function(data){
//	console.log(data);
});




/*
	Add Faye - a publish/subscribe messaging library to allow
	communication with the browser
*/
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});


/*
	When a tweet comes through with geodata, publish it to the
	browser over the /tweet channel
*/
var streamData = []
stream.on('data', function(data){
	if(data.coordinates && data.coordinates.coordinates){
		bayeux.getClient()
			.publish('/tweet', {
				coordinates: data.coordinates.coordinates,
				screen_name: data.user.screen_name,
				text: data.text,
				pic: data.user.profile_image_url
			});
	} else if(data.place){
	  var place = data.place.bounding_box.coordinates[0][0];
	   bayeux.getClient()
			 .publish('/tweet', {
	        coordinates: place,
	      	screen_name: data.user.screen_name,
	      	text: data.text,
	      	pic: data.user.profile_image_url
	    });
	}
});


// start the app listening on port 3000 with faye attached


var server = http.createServer(app);
bayeux.attach(server);
server.listen(app.get('port'), function(){
	console.log("Server started, port server is", app.get('port'));
});
