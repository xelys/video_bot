const db = require('./db')
const verifySignature = require('./verifySignature')
const invoke = require('./invoke')
const gateway = require('./gateway')
const service = require('./service')

exports.handler = async function handler (event) {
  return gateway.toResponse(await service(gateway.parseEvent(event), verifySignature, db, invoke, process.env.SIGNING_KEY))
}
