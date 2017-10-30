const argv = require('yargs').argv
const co = require('co')
const assert = require('assert')
const PrettyError = require('pretty-error')
const chalk = require('chalk')
const perror = new PrettyError()

class Task {
  constructor (fn) {
    this._fn = fn
    this.assert = assert
  }

  run (opts) {
    const wrap = co.wrap(this._fn).bind(this)
    const fn = wrap(opts || argv)

    fn.then(res => {
      console.log(`\n${chalk.green('Success:')}\n`)

      if (Object.prototype.toString.call(res) === '[object Object]') {
        Object.keys(res).map(prop => {
          console.log(`  ${prop}: ${chalk.green(res[prop])}`)
        })
      } else {
        console.log(res)
      }

      process.nextTick(() => process.exit())
    }).catch(err => {
      if (err.code === 'ERR_ASSERTION') {
        console.log(chalk.red('\nError:'), err.message)
      } else {
        console.log(perror.render(err))
      }
      process.nextTick(() => process.exit(1))
    })
  }
}

module.exports = Task
