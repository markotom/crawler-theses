const mongoose = require('../lib/mongoose')
const Schema = mongoose.Schema

// Schema (no strict)
let thesisSchema = new Schema({
  title: String,
  author: String,
  details: String,
  year: Number
}, {
  timestamps: true,
  strict: false
})

module.exports = mongoose.model('Thesis', thesisSchema)
