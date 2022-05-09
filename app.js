require ('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const cloudinary = require('./utils/cloudinary');
const cors = require('cors')

var indexRouter = require('./routes/index');
var authentificationRouter = require('./routes/authentification');
var usersRouter = require('./routes/user');
var roomsRouter = require('./routes/Rooms');
var ConservatoriessRouter = require('./routes/Conservatories');
var songsRouter = require('./routes/song');
var songsArtistRouter = require('./routes/Artist');

var recordsRouter = require('./routes/Record');
const uploadRouter=require('./routes/upload')
const videolist=require('./routes/VideoList')

var playlistsRouter = require('./routes/Playlists');

var reclamationsRouter = require('./routes/Reclamation');

var queuesRouter = require('./routes/Queues');
var commentsRouter = require('./routes/Comments');
var ratingsRouter = require('./routes/Ratings');
var mongoose=require('mongoose');
var config=require("./database/db.json");
const morgan = require('morgan');
const checkAuth = require('./middleware/auth');
var app = express();
var http = require('http').createServer(app)

require ("dotenv").config();
mongoose.connect(config.mongo.uri,
  
  {useNewUrlParser:true,
    useUnifiedTopology:true
  }
  ,()=>console.log('connected to the data base'));
  app.use(morgan('dev'));


  app.use(express.static("uploads"));
  app.use(express.static("imagesConservatoire"));

  app.use(bodyParser.urlencoded({extended: false}));
// Extracts json data and makes it easy readable to us
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('./images', express.static('images'));

app.use('/', indexRouter);
app.use('/authentification', authentificationRouter);
app.use('/user', usersRouter);
app.use('/api/room', roomsRouter);
app.use('/api/rating', ratingsRouter);
app.use('/song', songsRouter);
app.use('/conservatory', ConservatoriessRouter);
app.use('/record', recordsRouter);
//app.use('/videolist',videolist);
app.use('/playlist', playlistsRouter);
app.use('/song-artist',songsArtistRouter)
app.use(cors());
app.use('/api/videos', express.static('media/uploads'));
app.use('/api/avatars', express.static('media/avatars'));
app.use('/upload', uploadRouter);
app.use('/videolist',checkAuth, videolist);

app.use('/api/reclamation', reclamationsRouter);
app.use('/api/comment', commentsRouter);
app.use('/api/queue', queuesRouter);



// jwt
//app.get('*', checkAuth);
//hedhi badalt feha _id w locals tal3et mawjouda fel middleware 
 app.get('/jwtid', checkAuth, async(req, res) => {
  res.status(200).send(res.locals.user.id)
}); 


//Configure facebook Strategy
/* passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID_FB,
  clientSecret: process.env.CLIENT_SECRET_FB,
  callbackURL: "http://localhost:3000/Authenticate"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

//Authenticate facebook Requests
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/authentification' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// ***************************DEPLOYMENT *******************//
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}


// ***************************DEPLOYMENT *******************//
const port = process.env.PORT || 5000
http.listen(port, () => {
  console.log('Server is running on port', port)
})

module.exports = app;
