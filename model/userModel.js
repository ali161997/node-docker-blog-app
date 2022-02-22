const mongoose = require('mongoose');
const schema = mongoose.Schema({
  name: {
    require: [true, 'name required'],
    type: String,
    unique: true,
  },
  password: {
    require: [true, 'password required'],
    type: String,
  },
});
const User = mongoose.model('User', schema);
module.exports = User;
