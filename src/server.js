require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const hbs = require('express-handlebars');
const favicon = require('serve-favicon');
const router = require('./routes/main');
const postRoutes = require('./routes/posts');
const subredditRoutes = require('./routes/subreddit');
const commentRoutes = require('./routes/comment');
const authRoutes = require('./routes/auth');
const repliesRoutes = require('./routes/replies');

const app = express();

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var checkAuth = (req, res, next) => {
  console.log('Checking authentication');
  if (
    typeof req.cookies.nToken === 'undefined' ||
    req.cookies.nToken === null
  ) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs({
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    extname: 'hbs',
    defaultLayout: 'main',
  })
);
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(router);
app.use('/posts', postRoutes);
app.use('/n', subredditRoutes);
app.use(commentRoutes);
app.use(authRoutes);
app.use(repliesRoutes);

require('./data/reddit-db');

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});

module.exports = app;
