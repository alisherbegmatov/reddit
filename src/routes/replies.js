const express = require('express');
const router = express.Router();
const repliesController = require('../controllers/replies');

router.get(
  '/posts/:postId/comments/:commentId/replies/new',
  repliesController.getNewReply
);
router.post(
  '/posts/:postId/comments/:commentId/replies',
  repliesController.addNewReply
);

module.exports = router;
