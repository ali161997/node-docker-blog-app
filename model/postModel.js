const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, 'Post should have title'],
  },
  body: {
    type: String,
    require: [true, 'Post should have body '],
  },
});
const postModel = mongoose.model('post', postSchema);
module.exports = postModel;
