const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment cannot be empty'],
    trim: true,
    maxlength: [1000, 'Comment must be less than 1000 characters']
  },
  note: {
    type: mongoose.Schema.ObjectId,
    ref: 'Note',
    required: [true, 'Comment must belong to a note']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  replies: [{
    content: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update timestamp when comment is modified
commentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.updatedAt = Date.now();
    this.isEdited = true;
  }
  next();
});

// Populate user data
commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'replies.user',
    select: 'name email'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;