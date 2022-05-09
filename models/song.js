var mongoose = require("mongoose");
const { youtube } = require("scrape-youtube");

var Schema = mongoose.Schema;

var Song = new Schema({
    Name:{
      type: String,
      require: true,
      min:3,
      max:20
  },
    Artist:{
      type: String,
      require: true,
      min:2,
      max:40
  },
  Duration:{
    type:String,
    require: true,

  },
  Genre:{
    type:String,
    require: false,
  },
  Lyrics:{
    type:String,
    require: false,
    min:50,
  },
  Description:{
  type:String,
  require: false,
  min:10,

  },

  Photo:{
    type:String,
    require: false
  },

  Youtubelink:{
    type:String,
    require: true
  }
    
  });
  const model = mongoose.model("Song", Song);
  module.exports = model;