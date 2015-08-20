var mongoose  = require('mongoose');

var tweetstreamSchema = new mongoose.Schema({
  searchTerm: {type: String},
  followersCount: {type: Number},
  friendsCount: {type: Number}
})


module.exports = mongoose.model('TweetStream', tweetstreamSchema)
