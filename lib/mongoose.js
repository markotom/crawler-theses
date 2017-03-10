const config = require('../config').mongo
const mongoose = require('mongoose')
const logger = require('./logger')

// Using native promises
mongoose.Promise = Promise

// Set mongo url
config.url = `mongodb://${config.host}:${config.port}/${config.db}`

// Set options
let options = {}

// Set auth options
config.user && (options.user = config.user)
config.password && (options.pass = config.password)

// Connect to mongo
mongoose.connect(config.url, options)

// Listen for errors
mongoose.connection.on('error', function () {
  logger.error('Something went wrong when trying to connect to MongoDB')
})

// Listen for a successful connection
mongoose.connection.on('open', function () {
  logger.info(`Crawler is connected to ${config.url}`)
})

module.exports = mongoose
