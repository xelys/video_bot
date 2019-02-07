const aws = require('aws-sdk')
const lambda = new aws.Lambda({
  region: 'us-east-1'
})

module.exports = function (channel, messageTimestamp, url) {
  return lambda.invoke({
    InvocationType: 'Event',
    FunctionName: process.env.PROCESS_FUNCTION,
    Payload: JSON.stringify({ channel: channel, message_ts: messageTimestamp, url })
  }).promise()
}
