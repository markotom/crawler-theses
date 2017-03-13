const Xray = require('x-ray')
const xray = new Xray({
  filters: require('./filters')
})

module.exports = xray
