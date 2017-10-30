const mongoose = require('../lib/mongoose')
const Schema = mongoose.Schema
const { v4 } = require('uuid')

// Schema (no strict)
let thesisSchema = new Schema({
  uuid: { type: String, default: v4 },
  author: { type: String },
  advisor: { type: String },
  advisor2: { type: String },
  advisor3: { type: String },
  degree: { type: String },
  title: { type: String },
  year: { type: Number },
  college: { type: String },
  institution: { type: String },
  keywords: { type: Array },
  rawData: Schema.Types.Mixed
}, {
  timestamps: true
})

module.exports = mongoose.model('Thesis', thesisSchema)
