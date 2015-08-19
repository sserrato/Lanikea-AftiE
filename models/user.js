var mongoose  = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  name: {type: String}
  ,email: {type: String, required: true, unique: true}
  ,password: {type: String, required: true, select: false}
  ,admin: {type: Boolean, default: false}
  // ,dataStream:[{storingData: Boolean, default: false, followers_count: number}]

})

// hash the password before the user is saved

userSchema.pre('save', function(next){
  var user = this;
  // hash the password only if the password has not changed or if the new is new to the app
  if(!user.isModified('password')) return next();
  // generate salt - bcrypt method
    bcrypt.genSalt(5, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);

          // change the password to the hashed version
          user.password = hash;
          next();
      })
    })
})

// applying an authentication method to user Schema
  userSchema.methods.authenticate = function(password){
    var user = this
    return bcrypt.compareSync(password, user.password);
    bcrypt.compare(password, user.password, function(err, isMatch){
      callback(null, isMatch);
    })
  };

module.exports = mongoose.model('User', userSchema)
