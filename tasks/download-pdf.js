// node tasks/download-pdf
const config = require('../config').crawling
const chalk = require('chalk')
const Task = require('../lib/task')
const fs = require('fs')
const path = require('path')
const x = require('../lib/x-ray')
const request = require('superagent')
const Thesis = require('../models/thesis')

const task = new Task(async function (argv) {
  const count = await Thesis.count()
  console.log(chalk.blue(`Downloading ${count} theses`))
  const theses = Thesis.find().cursor()
  for (let thesis = await theses.next(); thesis != null; thesis = await theses.next()) {
    const { file: thesisUrl } = thesis.rawData

    const pdfUrl = await x(thesisUrl, 'frame[name=principal]@src')
    const writePdfStream = fs.createWriteStream(path.resolve(__dirname, `../pdfs/${thesis.uuid}.pdf`))
    const requestPdf = request.get(pdfUrl)
    requestPdf.pipe(writePdfStream)
    writePdfStream.on('close', function() {
      console.log(chalk.green('Downloaded'), chalk.cyan(`${thesis.uuid}.pdf`))
    })

    writePdfStream.on('error', function() {
      console.log(chalk.red('Failed download'))
    })
  }
})

task.run()
