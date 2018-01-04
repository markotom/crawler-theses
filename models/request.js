const mongoose = require('../lib/mongoose')
const Schema = mongoose.Schema
const { v4 } = require('uuid')

// Schema
let requestSchema = new Schema({
  uuid: { type: String, default: v4 },
  resource: { type: String },
  url: { type: String },
  rawData: Schema.Types.Mixed
}, {
  timestamps: true
})

module.exports = mongoose.model('Request', requestSchema)
