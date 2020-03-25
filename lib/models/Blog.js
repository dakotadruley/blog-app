const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blogId'
});

schema.statics.topHandles = function() {
  return this
    .aggregate([
      {
        '$group': {
          '_id': '$author', 
          'count': {
            '$sum': 1
          }
        }
      }
    ]);
};

schema.statics.mostCommented = function(count = 10) {
  return this
    .aggregate([
      {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'tweetId', 
          'as': 'comments'
        }
      }, {
        '$project': {
          '_id': true, 
          'author': true, 
          'title': true, 
          'content': true,
          'totalComments': {
            '$size': '$comments'
          }
        }
      }, {
        '$limit': count
      }
    ]);
};

module.exports = mongoose.model('Blog', schema);
