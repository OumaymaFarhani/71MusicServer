var express = require("express");
var router = express.Router();
var Song = require("../models/song");

/* GET all songs */
router.get("/getSongs", async function (req, res) {
  const songs = await Song.find().exec();
  res.status(200).json(songs);
});

/*POST Song*/

router.post("/postSong", async function (req, res, next) {
  const newSong = new Song({
    Name: req.body.Name,
    Artist: req.body.Artist,
    Duration: req.body.Duration,
    Genre: req.body.Genre,
    Lyrics: req.body.Lyrics,
    Youtubelink: req.body.Youtubelink,
    Description: req.body.Description,
    Photo: req.body.Photo,
  });

  try {
    const song = await newSong.save();
    return res.status(201).json(song);
  } catch (err) {
    return res.status(400).send(err);
  }
});

//Delete Song
router.get("/deleteSong/:id", function (req, res, next) {
  const id = req.params.id;

  Song.findByIdAndDelete(id)
  .then((data) => {
    if (!data) {
      res
        .status(404)
        .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
    } else {
      res.send({
        message: "Song was deleted successfully!",
      });
    }
  })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Song with id=" + id,
      });
    });
});

//update song :
router.put("/updateSong/:id", async function (req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .send({ message: "Data to update can not be empty!" });
  }

  const id = req.params.id;
  Song.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Update song with ${id}. Maybe song not found!`,
          });
      } else {
        res.send({ message: ` Updated Song with id : ${id}. Succefully!` });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update song information" });
    });
});

//getSongById: detailedSong
router.get("/getSong/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const song = await Song.findById(id).exec();
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
