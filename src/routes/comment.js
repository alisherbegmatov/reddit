const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment');

router.post('/posts/:postId/comments', commentController.newComment);

module.exports = router;
