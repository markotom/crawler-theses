const _ = require('lodash')

module.exports = {
  title: function (value) {
    if (typeof value !== 'string') return value

    let pattern = /title\s?=\s?'(.*)';/
    let match = value.match(pattern)
    return match[1].split('/')[0]
  },
  trim: function (value) {
    return typeof value === 'string' ? value.trim() : value
  },
  clean: function (value) {
    if (typeof value !== 'string') return value

    value = value.slice(-1) === ',' ? value.slice(0, -1) : value
    value = value.replace(/\n|\r/gim, '')

    return value
  },
  unescape: _.unescape,
  url: function (value, which) {
    if (typeof value !== 'string') return value

    let urls = value.match(/(http|https|ftp):\/\/(www\.)?[--zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    return urls ? urls[which || 0] : value
  },
  fullname: function (value) {
    if (typeof value !== 'string') return value

    value = value.replace('asesor.', '').trim()
    value = value.replace('asesor', '').trim()
    value = value.replace('sustentante.', '').trim()
    value = value.replace('sustentante', '').trim()
    value = value.slice(-1) === ',' ? value.slice(0, -1) : value
    value = value.split(',')[0] + ',' + value.split(',')[1]

    return value
  },
  institution: function (value) {
    if (typeof value !== 'string') return value

    value = value.replace('Universidad Nacional Autónoma de México.', '').trim()
    value = value.replace('Universidad Nacional Autónoma de México', '').trim()
    value = value.replace('entidad participante.', '').trim()
    value = value.replace('entidad participante', '').trim()
    value = value.slice(-1) === ',' ? value.slice(0, -1) : value

    return value
  }
}
