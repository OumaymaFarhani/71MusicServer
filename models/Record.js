var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Record = new Schema({
    Category:{
      type: String,
      require: true,
      min:3,
      max:20
  },
    Title:{
      type: String,
      require: true,
      min:3,
      max:20
  },
  Score:{
    type: Number,
    default:0

  }
    
  });
  const model = mongoose.model("Record", Record);
  module.exports = model;