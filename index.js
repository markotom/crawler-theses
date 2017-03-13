const config = require('./config')
const chalk = require('chalk')
const logger = require('./lib/logger')
const qs = require('query-string')
const filters = require('./lib/filters')
const JSONStream = require('JSONstream')
const Thesis = require('./models/thesis')
const x = require('./lib/x-ray')

// Set options from config
let options = config.crawling

// Somebody can explain this to me?
let query = {
  func: 'find-c',
  ccl_term: `( WRD = ( alldocuments ) ) and WGR = ( ${options.criteria.degree} ) and ( WYR = ( ${options.criteria.since} -> ${options.criteria.until} ) )`
}

// Set crawler logic
let crawler = x(options.url + '?' + qs.stringify(query), '#resultSetSearch', {
  theses: x('tbody', [{
    author: '.td1 | trim | clean',
    title: '.td2 script | title | trim | clean',
    file: x('.td4@html | unescape | url:0', 'body@onload | unescape | url:0'),
    meta: x('.td0 a@href', {
      properties: ['#resultSetSearch th | trim | clean'],
      values: ['#resultSetSearch td | trim | clean']
    }),
    year: '.td3 | trim | clean'
  }])
})
.paginate('a[title="Next"]@href')
.limit(options.pageLimit)
.stream()

// Set stream JSON parser
const stream = JSONStream.parse('*.theses')

// Add JSON parser as pipe
crawler.pipe(stream)

// Get streamed JSON
stream.on('data', function (theses) {
  logger.info('\n\nReceived chunk for ' + chalk.green(theses.length) + ' theses')

  // Insert theses on database
  theses.map(function (thesis) {
    let properties = thesis.meta.properties
    let values = thesis.meta.values

    // Extract and format metas
    values.map(function (value, index) {
      if (value) {
        let property = properties[index] || properties[index - 1]

        if (property && !thesis.meta[property]) {
          thesis.meta[property] = value
        } else if (property && thesis.meta[property]) {
          thesis.meta[property] = Array.isArray(thesis.meta[property]) ? thesis.meta[property] : [thesis.meta[property]]
          thesis.meta[property].push(value)
        }
      }
    })

    // Add additional info and format
    thesis.degree = thesis.meta['Grado']
    thesis.format = thesis.meta['Soporte']
    thesis.legal = thesis.meta['Restricciones']
    thesis.description = thesis.meta['Descr. Física']
    thesis.advisor = thesis.meta['Sustentante/Asesor']
    thesis.institution = thesis.meta['Sec. Corporativo']

    if (Array.isArray(thesis.institution)) {
      thesis.institution = thesis.institution[1] || thesis.institution[0]
    }

    thesis.institution = filters.institution(thesis.institution)

    if (!Array.isArray(thesis.advisor)) {
      thesis.advisor = filters.fullname(thesis.advisor)
    } else {
      thesis.advisor.map((advisor, index) => {
        advisor = filters.fullname(advisor)

        if (index > 0) {
          thesis['advisor' + (index + 1)] = advisor
        } else {
          thesis.advisor = advisor
        }
      })
    }

    delete thesis.meta

    // Upserting document
    Thesis.findOneAndUpdate({
      title: thesis.title
    }, {
      $set: thesis
    }, {
      upsert: true
    })
    // Successful upsert
    .then(function (model) {
      let action = model ? 'updated' : 'inserted'
      logger.info(`Thesis has been ${action}: ${chalk.green(thesis.title)}`)
    })
    // Catch errors
    .catch((err) => {
      logger.error('MongoDB error', err)
    })
  })
})

// Catch crawling errors
crawler.on('error', (err) => {
  logger.error('Something went wrong when trying to crawl', err)
})

// Finish process
crawler.on('end', () => setTimeout(process.exit, 3000))
