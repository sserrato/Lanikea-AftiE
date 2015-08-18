var User = require('../models/user.js');

  function createUser(req, res){
    var user = new User(req.body.user);
  	// save the user and check for errors
  	user.save(function(err){
  		if(err){
  			return res.status(401).send({message: err.errmsg});
  		}
  		else{
  			return res.status(200).send({message: 'user has been created. rejoice!'});
  		}
  	})
  }

  function showUsers(req, res){
  	User.find({}, function(err, users){
  		if(err) return res.status(401).send({message: err.errmsg});
  			res.json(users);
  	});
  };

  function findUser(req, res){
		User.findOne({_id: req.params.id}, function(err,user){
			if(err) res.json({message: "Error w ID"});
				res.json(user)
		});
	};

  function editUser(req,res){
  	User.findOneAndUpdate({_id: req.params.id}, req.body, function(err, user){
  		if (err){
  			console.log(err);
  			res.json({message: "Update error. Try again. Logging reqbodyuser " + req.body})
  			return
  		} else {
  			res.json({message: "User has been updated"});
  			console.log("User updated");
  			console.log(req.body.params + "this is what is supposed to be updated");
  		}
  	})
  };

  function deleteUser(req, res){
    User.findOneAndRemove({_id: req.params.id}, function(err, user){
      if (err) {
        res.json({message: "User not deleted"});
      }else{
        res.json({message: "user deleted"});
      }
    })
    }


module.exports = {
  createUser: createUser,
  showUsers: showUsers,
  findUser: findUser,
  editUser: editUser,
  deleteUser: deleteUser
};
