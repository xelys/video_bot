module.exports = (function () {
  const self = {}

  self.parseEvent = function (event) {
    const body = event.body
    const timestamp = event.headers['X-Slack-Request-Timestamp']
    const signature = event.headers['X-Slack-Signature']
    let parsedBody = null
    try {
      parsedBody = JSON.parse(body)
    } catch (err) {
      return false
    }
    if (typeof body === 'string' && body.length > 0 && typeof timestamp === 'string' && timestamp.length > 0 &&
      typeof signature === 'string' && signature.length > 0) {
      return { body, timestamp, signature, parsedBody }
    } else {
      return false
    }
  }

  self.toResponse = function (body) {
    if (typeof body === 'number') {
      return {
        'isBase64Encoded': 'false',
        'statusCode': body
      }
    } else {
      return {
        'isBase64Encoded': 'false',
        'statusCode': 200,
        'headers': { 'Content-Type': 'application/json' },
        'body': JSON.stringify(body)
      }
    }
  }

  return self
}())
