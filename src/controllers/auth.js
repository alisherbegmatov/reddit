const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signupForm = (req, res, next) => {
  var currentUser = req.user;
  return res.render('auth/sign-up', { currentUser });
};

exports.signupUser = (req, res, next) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      var token = jwt.sign({ _id: user._id }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).send({ err: err });
    });
};

exports.logout = (req, res, next) => {
  res.clearCookie('nToken');
  res.redirect('/');
};

exports.loginForm = (req, res, next) => {
  var currentUser = req.user;
  res.render('auth/login', { currentUser });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username }, 'username password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Wrong Username or Password' });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          return res
            .status(401)
            .send({ message: 'Wrong Username or password' });
        }

        const token = jwt.sign(
          { _id: user._id, username: user.username },
          process.env.SECRET,
          {
            expiresIn: '60 days',
          }
        );

        res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
        res.redirect('/');
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
