var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Rating = new Schema({
  RoomId:{ 
    type: Schema.Types.ObjectId,
     ref: "Room" },
Rate:{
    type: Number,

}
});
const model = mongoose.model("Rating", Rating);
module.exports = model;
