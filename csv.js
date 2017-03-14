const chalk = require('chalk')
const logger = require('./lib/logger')
const Thesis = require('./models/thesis')
const Stream = require('json2csv-stream')
const fs = require('fs')

// Set options
let options = {
  file: 'theses.csv',
  fields: [
    'institution',
    'degree',
    'title',
    'author',
    'advisor',
    'advisor2',
    'year',
    'legal',
    'format',
    'description',
    'file'
  ]
}

// Set iterator
let i = 0

// Set stream to write a CSV file
let writer = fs.createWriteStream('./' + options.file)

// Set stream to parse and convert JSON to CSV
let parser = new Stream({
  del: '|',
  keys: options.fields
})

// Set writer as pipe to parser
parser.pipe(writer)

// Count theses inserted on file
parser.on('line', (data) => i++)

// Get all theses through stream (cursor)
Thesis.find()
  .sort({ year: -1, title: 1 })
  .cursor({ transform: JSON.stringify })
  .on('data', thesis => parser.write(thesis))
  .on('end', () => {
    setTimeout(function () {
      logger.info(chalk.green(i) + ' theses have been exported to file ' + chalk.green(options.file))
      process.exit()
    }, 3000)
  })
