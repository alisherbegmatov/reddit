const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');

router.post('/new', postController.newPost);
router.get('/new', postController.newPostForm);
router.get('/:id', postController.postDetails);
router.put('/:id/vote-up', postController.voteUp);
router.put('/:id/vote-up', postController.voteDown);

module.exports = router;
