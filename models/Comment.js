var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Comment = new Schema({
    Author:{
    type:String,
    
},
BodyCom:{
    type: String,
    require: true,
    min:3,
    max:500
},
UserId:{
    type:String,
},
RoomId:{
    type:String,
}

});
const model = mongoose.model("Comment", Comment);
module.exports = model;