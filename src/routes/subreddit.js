const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');

router.get('/:subreddit', postController.getPostsBySubreddit);

module.exports = router;
