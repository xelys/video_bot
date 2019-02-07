const db = require('./db')
const net = require('./net')
const youtubeDLRunner = require('./youtubeDLRunner')
const service = require('./service')

exports.handler = async function (event) {
  await service(event, db, net, youtubeDLRunner, process.env.REDIRECT_BASE_URL, Date.now())
}
