const express = require('express');
const noteController = require('../controllers/noteController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Note CRUD operations
router.route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNote);

router.route('/:id')
  .get(noteController.getNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

// Note collaboration features
router.route('/:id/collaborators')
  .patch(noteController.addCollaborator);

router.route('/:id/like')
  .patch(noteController.toggleLike);

// Mount comment router
router.use('/:noteId/comments', commentRouter);

module.exports = router;