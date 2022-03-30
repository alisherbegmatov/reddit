const Post = require('../models/post');
const User = require('../models/user');

exports.newPostForm = (req, res, next) => {
  var currentUser = req.user;
  return res.render('posts/posts-new', { currentUser });
};

exports.newPost = (req, res, next) => {
  if (req.user) {
    var post = new Post(req.body);
    post.author = req.user._id;
    post.upVotes = [];
    post.downVotes = [];
    post.voteScore = 0;
    post
      .save()
      .then((post) => {
        return User.findById(req.user._id);
      })
      .then((user) => {
        user.posts.unshift(post);
        user.save();

        res.redirect(`/posts/${post._id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  } else {
    return res.status(401);
  }
};

exports.postDetails = (req, res, next) => {
  var currentUser = req.user;
  Post.findById(req.params.id)
    .populate('comments')
    .lean()
    .then((post) => {
      res.render('posts/posts-show', { post, currentUser });
    })
    .catch((err) => {
      throw err.message;
    });
};

exports.getPostsBySubreddit = (req, res, next) => {
  var currentUser = req.user;
  Post.find({ subreddit: req.params.subreddit })
    .lean()
    .then((posts) => {
      console.log(posts);
      res.render('posts/posts-index', { posts, currentUser });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.voteUp = (req, res, next) => {
  Post.findById(req.params.id).exec(function (err, post) {
    post.upVotes.push(req.user._id);
    post.voteScore = post.voteScore + 1;
    post.save();

    res.status(200);
  });
};

exports.voteDown = (req, res, next) => {
  Post.findById(req.params.id).exec(function (err, post) {
    post.downVotes.push(req.user._id);
    post.voteScore = post.voteScore - 1;
    post.save();
    res.status(200);
  });
};
