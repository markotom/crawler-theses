const config = require('./config')
const chalk = require('chalk')
const logger = require('./lib/logger')
const qs = require('query-string')
const JSONStream = require('JSONstream')
const Thesis = require('./models/thesis')
const x = require('./lib/x-ray')

// Set options
let options = config.crawling

// Somebody can explain this to me?
let query = {
  func: 'find-c',
  ccl_term: `( WRD = ( alldocuments ) ) and WGR = ( ${options.criteria.degree} ) and ( WYR = ( ${options.criteria.since} -> ${options.criteria.until} ) )`
}

// Set element selectors
let elements = {
  searchContainer: '#resultSetSearch',
  itemContainer: '#resultSetSearch'
}

// Set crawler logic
let crawler = x(options.url + '?' + qs.stringify(query), elements.searchContainer, {
  columns: x('thead', ['th']),
  theses: x('tbody', [{
    author: '.td1 | trim | clean',
    title: '.td2 script | title | trim | clean',
    details: '.td0 a@href',
    meta: x('.td0 a@href', {
      properties: [elements.itemContainer + ' th | trim | clean'],
      values: [elements.itemContainer + ' td | trim | clean']
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

// Get JSON
stream.on('data', function (theses) {
  logger.info('Received chunk for ' + chalk.green(theses.length) + ' theses')

  // Insert theses on database
  theses.map(function (thesis) {
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
