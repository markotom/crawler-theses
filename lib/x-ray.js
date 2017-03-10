const Xray = require('x-ray')
const xray = new Xray({
  filters: {
    title: function (value) {
      let pattern = /title\s?=\s?'(.*)';/
      let match = value.match(pattern)
      return match[1].split('/')[0]
    },
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    clean: function (value) {
      if (typeof value === 'string') {
        value = value.slice(-1) === ',' ? value.slice(0, -1) : value
        value = value.replace(/\n|\r/gim, '')
      }

      return value
    }
  }
})

module.exports = xray
