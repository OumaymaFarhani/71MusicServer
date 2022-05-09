const { spawn } = require('child_process');
const { createWriteStream } = require('fs');

const VideoDetails = require('../models/Videothumbnail');
const port = require('../config/default').port;

const ffmpegPath = 'C:/ffmpeg/bin/ffmpeg';
const width = 256;
const height = 144;

const generateThumbnail = (target, title, FirstName) => {
  title = title.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, '');
  let tmpFile = createWriteStream('media/uploads/video_thumbnails/' + title + '.jpg');
  const ffmpeg = spawn(ffmpegPath, [
    '-ss',
    0,
    '-i',
    target,
    '-vf',
    `thumbnail,scale=${width}:${height}`,
    '-qscale:v',
    '2',
    '-frames:v',
    '1',
    '-f',
    'image2',
    '-c:v',
    'mjpeg',
    'pipe:1'
  ]);
  ffmpeg.stdout.pipe(tmpFile);
  const videoDetails = new VideoDetails({
    uploader_name: FirstName,
    upload_title: title,
    video_path: target,
    thumbnail_path: 'http://127.0.0.1:' + port + '/api/videos/video_thumbnails/' + encodeURIComponent(title + '.jpg')
  });
  videoDetails
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}



verifyAccessToken: (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized())
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader.split(' ')
  const token = bearerToken[1]
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
      return next(createError.Unauthorized(message))
    }
    req.payload = payload
    next()
  })
},

module.exports = {
  generateThumbnail: generateThumbnail
}





/* 
const ffmpegPath = 'C:/Users/HP/Desktop/seconde front/musicunivers/ffmpeg';
 */