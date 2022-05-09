const express = require('express');
const router = express.Router();
const Users = require('../models/User')

const Videothumbnail = require('../models/Videothumbnail');

router.get('/', (req, res, next) => {
uploadername=req.user.name
console.log(uploadername)
  Videothumbnail
    .find({uploader_name:uploadername})
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;