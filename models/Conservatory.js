const { type } = require("express/lib/response");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Conservatory = new Schema({
  Title:{
    type: String,
    require: true,
    min:3,
    max:20
},

picture:{
  type: String,
    require: true
},
cloudinary_id:{
type:String
},
 Description:{
   type: String,
   require: true,
   min:3,
   max:150
},
upVoted: {type: Number, default:0},
downVoted : {type: Number, default:0}

  

});
const model = mongoose.model("Conservatory",Conservatory);
module.exports = model;