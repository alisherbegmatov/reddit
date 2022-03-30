const Post = require('../models/post');

exports.index = (req, res, next) => {
  var currentUser = req.user;
  Post.find()
    .lean()
    .populate('author')
    .then((posts) => {
      return res.render('posts/posts-index', { posts, currentUser });
    })
    .catch((err) => {
      throw err.message;
    });
};
