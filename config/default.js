'use strict'

module.exports = {
  crawling: {
    url: 'http://oreon.dgbiblio.unam.mx/F',
    pageLimit: 2,
    criteria: {
      degree: 'filosofía',
      since: '1800',
      until: '2100'
    }
  },
  mongo: {
    port: process.env.MONGO_PORT_27017_TCP_PORT || 27017,
    host: process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost',
    db: process.env.MONGO_PORT_27017_TCP_DATABASE || 'crawlers',
    user: process.env.MONGO_PORT_27017_TCP_USER || '',
    password: process.env.MONGO_PORT_27017_TCP_PASSWORD || ''
  },
  redis: {
    host: process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1',
    port: process.env.REDIS_PORT_6379_TCP_PORT || 6379
  }
}
