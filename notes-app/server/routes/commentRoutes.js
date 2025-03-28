const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

// Comment CRUD operations
router.route('/')
  .post(commentController.createComment);

router.route('/:commentId')
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

// Comment interactions
router.route('/:commentId/replies')
  .post(commentController.addReply);

router.route('/:commentId/like')
  .patch(commentController.toggleCommentLike);

module.exports = router;