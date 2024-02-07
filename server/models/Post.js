/*  /server/models/Post.js  */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    // required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_modified: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Post', PostSchema)