var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  nickname: String,
  Birthday: Date,
  sexe: String,
  avatar: {type:String,
  require:true},
  email: {type:String,require:true,unique:true},
  password: {type:String,require:true},
  role: {
    type: Number,
    default: 0 // 0 = user, 1 = admin
},
followers:{
  type:[String]
},
following:{
  type:[String]
},
likes:{
  type:[String]
} 
 // required:true


  //facebookId: String
});

/* User.pre('save',async function(next){
try {

  const salt=await bcrsssssssypt.genSalt(10)
  const hashedPassword=await bcrypt.hash(this.password,salt)
  this.password=hashedPassword;
  next()  
} catch (error) {
  
  next(error)
}

})  */

const model = mongoose.model("UserSchema", UserSchema);
module.exports = model;
