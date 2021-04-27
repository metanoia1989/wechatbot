const fs = require('fs')
const pino = require('pino')
const path = require('path')
const { getToday } = require('./datetime')

const filename = path.join(__dirname, "..", `/logs/${getToday().trim()}.log`)  
if (!fs.existsSync(filename)) {
  fs.closeSync(fs.openSync(filename, 'w'))
}

const logger = pino(pino.destination({
  dest: filename, // omit for stdout
  minLength: 4096, // Buffer before writing
  sync: false // Asynchronous logging
}))

module.exports = logger