const mongoose = require('mongoose');
const slugify = require('slugify');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A note must have a title'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'A note must have content'],
    trim: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  slug: String,
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['Programming', 'Science', 'Business', 'Personal', 'Other'],
    default: 'Other'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }],
  collaborators: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A note must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  versionHistory: [{
    content: String,
    updatedAt: Date,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
noteSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Add version history when note is updated
noteSchema.pre('save', function(next) {
  if (!this.isModified('content')) return next();
  
  this.versionHistory.push({
    content: this.content,
    updatedAt: Date.now(),
    updatedBy: this.createdBy
  });
  
  this.updatedAt = Date.now();
  next();
});

// Populate createdBy field
noteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: 'name email'
  });
  next();
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;