var TweetStream = require('../models/tweet.js');

function  showTweets(req,res){
  TweetStream.find({}, function(err, tweetstoshow){
    if(err) return res.status(401).send({message: err.errmsg});
      res.json(tweetstoshow);
  })
  };

module.exports = {
  showTweets: showTweets
}
