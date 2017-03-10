const env = process.env.NODE_ENV || 'development'
const winston = require('winston')

/** Development Logger */
winston.loggers.add('development', {
  console: {
    level: 'debug',
    colorize: true,
    prettyPrint: false
  }
})

/** Production Logger */
winston.loggers.add('production', {
  console: {
    level: 'info',
    prettyPrint: false
  }
})

module.exports = winston.loggers.get(env)
