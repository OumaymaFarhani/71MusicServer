var express = require("express");
var router = express.Router();
var Song = require("../models/song");
const usetube = require("usetube");
const fs = require("fs");
var request = require("request");

router.post("/postSong", async function (req, res, next) {
  //https://www.youtube.com/watch?v=

  const Artist = req.body.Artist;
  usetube
    .searchVideo(Artist + " EdKara【No Guide Melody】 Instrumental")
    .then((results) => {
      // console.log(results.videos);
      console.log("Artist: " + Artist);
      var result = JSON.stringify(results.videos);
      result = result.replaceAll('"original_title"', '"Name"');
      result = result.replaceAll('"id"', '"Youtubelink"');
      result = result.replaceAll('"duration"', '"Duration"');
      result = result.replaceAll("Instrumental", "");
      result = result.replaceAll("【No Guide Melody】", "");
      result = result.replaceAll("Karaoke", "");
      result = result.replaceAll("  ", " ");
      result = result.replaceAll("{", '{"Artist":' + '"' + Artist + '",');
      result = result.replaceAll(
        '"Youtubelink":"',
        '"Youtubelink":"https://www.youtube.com/watch?v='
      );

      const obj = JSON.parse(result);

      fs.open("../Song.txt", "w+", function (fileExists, file) {
        if (!fileExists) {
          fs.writeFile("./Song.json", result, (err) => {
            if (err) console.error(err);
            console.log("Data written try");

            let ArtistData = fs.readFileSync("Song.json");
            let songs = JSON.parse(ArtistData);
            Song.insertMany(songs)
              .then(function () {
                console.log("Data inserted");
                return res.status(201).send(); // Success
              })
              .catch(function (error) {
                console.log(error);
                return res.status(400).send(err); // Failure
              });
          });
        } else {
          console.log("File already exists!");
        }
      });
    });
});

/* GET all songs */
router.get("/getSongs", async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  const songs = await Song.find().exec();
  //res.status(200).json(songs);
  res.status(200).json({songs:songs.map(song=>song.toObject({getters:true})) });
});

module.exports = router;
