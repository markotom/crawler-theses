// node tasks/keywords
const Task = require('../lib/task')
const Thesis = require('../models/thesis')
const fs = require('fs')

const task = new Task(async function (argv) {
  const keywords = await Thesis.aggregate([{
    $unwind: '$keywords'
  }, {
    $group: {
      _id: '$keywords',
      count: { $sum: 1 }
    }
  }, {
    $project: {
      _id: 0,
      keyword: '$_id',
      count: 1
    }
  }, {
    $sort: { count: -1 }
  }])

  fs.writeFileSync('tmp/keywords.json', JSON.stringify(keywords, null, 2))

  return { keywords: keywords.length }
})

task.run()
