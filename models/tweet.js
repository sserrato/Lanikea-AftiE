var mongoose  = require('mongoose');

var tweetstreamSchema = new mongoose.Schema({
  queryTerm: {type: String},
  followersCount: {type: Number},
  friendsCount: {type: Number},
  coordinates: {type: [Number]},
  country: {type: String},
  text: {type: String},
  screenName: {type: String},
  listedCount: {type: Number},
  statusesCount: {type: Number},
  favouritesCount: {type: Number},
  dateCreated: {type: Date, default: Date.now}
})


module.exports = mongoose.model('TweetStream', tweetstreamSchema)
