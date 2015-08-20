var mongoose  = require('mongoose');
// this is the tweetstream schema. we intend to embed the followersCount and friendsCount
var tweetstreamSchema = new mongoose.Schema({
  searchTerm: {type: String},
  followersCount: {type: Number},
  friendsCount: {type: Number}
})


module.exports = mongoose.model('TweetStream', tweetstreamSchema)
