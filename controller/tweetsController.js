var TweetStream = require('../models/tweet.js');

function showTweets(req,res){
  TweetStream.find({}, function(err, tweetstoshow){
    if(err) return res.status(401).send({message: err.errmsg});
      res.json(tweetstoshow);
  })
  };

  function findQuery(req, res){
    TweetStream.findOne({queryTerm: req.params.queryTerm}, function(err, queryTermResult){
      if(err) res.json({message: "Error w ID"});
        res.json(queryTermResult)
    });
  };


// function exposureRadius(req, res){
//   var queryTerm = req.params.queryTerm;
//   debugger
//     TweetStream.aggregate([
//       { $match: {
//           queryTerm: queryTerm
//       }},
//       {$group: {
//         _id: null,
//         followers_total: {$sum: "$followersCount"}
//       }}
//     ], function (err, res){
//       if (err) {
//         console.log(err);
//         return
//       }
//       console.log(res);
//     });
//   }
// hardcoded atempt
//
// // return one
// db.tweetstream.find({_id: ObjectId("55d65a332a910d5e3383b553")},function(err,data){
//   console.log(data);
// });
//   db.tweetstream.aggregate([
//     {
//       $match: { queryTerm: "lol"}
//     },
//     {
//       $group: {_id: "$cust_id", total: {$sum: "$followersCount"}}
//     }
//   ]), function (err, res){
//     if (err) {
//       console.log(err);
//       return
//     }
//     console.log(res);
//   });
//   }




module.exports = {
  showTweets: showTweets,
  findQuery: findQuery
//  exposureRadius: exposureRadius
}
