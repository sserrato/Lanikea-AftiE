// original code
// set up nTwitter with the api configuration in ./config.js
var config = require('./config.js'),
	twit = new ntwitter(config);

var config = require('.env'),

var twit = new ntwitter({
  CONSUMER_KEY: process.env.consumer_key,
	CONSUMER_SECRET: process.env.consumer_secret,
	ACCESS_TOKEN_KEY: process.env.access_token_key,
	ACCESS_TOKEN_SECRET: process.env.access_token_secret
})
