const Post = require('../models/post');
const Comment = require('../models/comment');

exports.newComment = (req, res, next) => {
  if (req.user) {
    const data = req.body;
    data['author'] = req.user._id;
    const comment = new Comment(data);

    comment
      .save()
      .then((comment) => {
        return Promise.all([Post.findById(req.params.postId)]);
      })
      .then(([post, user]) => {
        post.comments.unshift(comment);
        return Promise.all([post.save()]);
      })
      .then((post) => {
        res.redirect(`/posts/${req.params.postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return res.json({ message: 'Login to leave comment' });
  }
};
