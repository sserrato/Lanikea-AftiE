var express = require('express');
var bodyParser = require('body-parser');
// var methodOverride = require('method-override');
userRouter = express();


var usersController = require('../controller/usersController');

  // create an instance for the API routes


  apiRouter.get('/', function(req,res){
  	res.json({ message: 'Welcome to the API for CPS'});
  })

  apiRouter.route('/users')
  .post(usersController.createUser)//{
  .get(usersController.showUsers)

  apiRouter.route('/users/:id')
  	.get(usersController.findUser)
  	.patch(usersController.editUser)

// module.exports = userRouter;
