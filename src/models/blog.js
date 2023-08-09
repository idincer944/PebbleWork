const mongoose = require('mongoose');

// added comment in sepreat scheam due to the SOLID principles
// we can add another fields like imge,nested commnts, etc.
const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image:{
     type: String,
   
  }
});

module.exports = mongoose.model('Blog', blogSchema);
