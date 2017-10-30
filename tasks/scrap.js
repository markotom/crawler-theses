// node tasks/scrap --career filosofia --since 2000 --until 2017
const config = require('../config').crawling
const chalk = require('chalk')
const Task = require('../lib/task')
const qs = require('querystring')
const x = require('../lib/x-ray')
const JSONStream = require('JSONstream')
const Thesis = require('../models/thesis')

let count = 0
let created = 0
let failed = 0

const task = new Task(async function (argv) {
  const { career, since, until, pages } = argv

  this.assert(career, 'career is required')
  this.assert(since, 'since is required')
  this.assert.equal(typeof since, 'number', 'since should be a number')
  this.assert(until, 'until is required')
  this.assert.equal(typeof until, 'number', 'until should be a number')
  this.assert(since <= until, 'since should be less or equal than until')

  if (typeof pages !== 'undefined') {
    this.assert.equal(typeof pages, 'number', 'pages should be a number')
    this.assert(pages > 0, 'pages should be more than zero')
  }

  const query = {
    func: 'find-b',
    request: career,
    find_code: 'WGR',
    filter_code_2: 'WYR',
    filter_request_2: since,
    filter_code_3: 'WYR',
    filter_request_3: until
  }

  await scrap(config.url, query, pages)

  return { count, created, failed }
})

// Set stream JSON parser
const stream = JSONStream.parse('*.theses').on('data', items => {
  // Format fields
  items.map(function (item) {
    const { properties, values } = item.fields

    // Extract and format fields
    values.map(function (value, index) {
      if (value) {
        let property = properties[index] || properties[index - 1]

        if (property && !item.fields[property]) {
          property = property.replace(/\./gi, '')
          item.fields[property] = value
        } else if (property && item.fields[property]) {
          item.fields[property] = Array.isArray(item.fields[property]) ? item.fields[property] : [item.fields[property]]
          item.fields[property].push(value)
        }
      }
    })

    delete item.fields.properties
    delete item.fields.values

    // Creating thesis on database
    Thesis.create({
      rawData: item
    }).then(thesis => {
      console.log(chalk.green('Created'), thesis.uuid)
      created++
    }).catch(e => {
      console.log(chalk.red('Failed'), item.title, e)
      failed++
    })

    count++
  })
})

// Define a scrap function as yieldable
const scrap = function (url, query, limit = 1000000) {
  return new Promise((resolve, reject) => {
    const crawler = x(url + '?' + qs.stringify(query), '#resultSetSearch', {
      theses: x('tbody', [{
        fields: x('.td0 a@href', {
          properties: ['#resultSetSearch th | trim | clean'],
          values: ['#resultSetSearch td | trim | clean']
        }),
        author: '.td1 | trim | clean',
        title: '.td2 script | title | trim | clean',
        file: x('.td4@html | unescape | url:0', 'body@onload | unescape | url:0'),
        year: '.td3 | trim | clean'
      }])
    })
    .paginate('a[title="Next"]@href')
    .limit(limit)
    .stream()

    crawler.pipe(stream)
      .on('error', reject)
      .on('end', () => setTimeout(resolve, 3000))
  })
}

task.run()
