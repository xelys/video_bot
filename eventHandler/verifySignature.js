const { createHmac, timingSafeEqual } = require('crypto')

module.exports = function verifySignature (eventData, key) {
  const { timestamp, body, signature } = eventData
  const sigBasestring = 'v0:' + timestamp + ':' + body
  const hmac = createHmac('sha256', key)
  hmac.update(sigBasestring)
  const mySignature = 'v0=' + hmac.digest('hex')
  if (typeof signature !== 'string' || signature.length !== mySignature.length) {
    return false
  }
  return timingSafeEqual(Buffer.from(mySignature, 'binary'), Buffer.from(signature, 'binary'))
}
