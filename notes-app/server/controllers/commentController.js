const Comment = require('../models/Comment');
const Note = require('../models/Note');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createComment = catchAsync(async (req, res, next) => {
  // Check if note exists and is accessible
  const note = await Note.findOne({
    _id: req.params.noteId,
    $or: [{ isPublic: true }, { createdBy: req.user.id }, { collaborators: req.user.id }]
  });

  if (!note) {
    return next(new AppError('No note found with that ID or you are not authorized', 404));
  }

  const newComment = await Comment.create({
    content: req.body.content,
    note: req.params.noteId,
    user: req.user.id
  });

  // Add comment to note's comments array
  note.comments.push(newComment._id);
  await note.save();

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment
    }
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findOneAndUpdate(
    {
      _id: req.params.commentId,
      user: req.user.id
    },
    {
      content: req.body.content
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!comment) {
    return next(new AppError('No comment found with that ID or you are not authorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findOneAndDelete({
    _id: req.params.commentId,
    $or: [
      { user: req.user.id },
      { note: { $in: await Note.find({ createdBy: req.user.id }).select('_id') } }
    ]
  });

  if (!comment) {
    return next(new AppError('No comment found with that ID or you are not authorized', 404));
  }

  // Remove comment from note's comments array
  await Note.findByIdAndUpdate(
    comment.note,
    { $pull: { comments: comment._id } }
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addReply = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $push: {
        replies: {
          content: req.body.content,
          user: req.user.id
        }
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

exports.toggleCommentLike = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  
  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  const hasLiked = comment.likes.includes(req.user.id);
  
  if (hasLiked) {
    comment.likes.pull(req.user.id);
  } else {
    comment.likes.push(req.user.id);
  }

  await comment.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});