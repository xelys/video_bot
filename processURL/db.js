const URLProcessorError = require('./error')
const aws = require('aws-sdk')
var docClient = new aws.DynamoDB.DocumentClient()

module.exports = (function db () {
  const self = {}
  self.saveVideoInfo = async function (channel, messageTimestamp, videoURL, fileName, streamURL) {
    const params = {
      TableName: 'messages',
      Item: {
        channel, message_ts: messageTimestamp, video_url: videoURL, file_name: fileName, stream_url: streamURL, last_updated: Date.now()
      }
    }
    await retry(() => docClient.put(params).promise(), 'Error saving video info to database')
  }

  self.getMessages = async function () {
    var params = {
      TableName: 'messages',
      ProjectionExpression: 'channel, message_ts, video_url, file_name, stream_url, last_updated'
    }
    const data = await retry(() => docClient.scan(params).promise())
    return data.Items
  }
  return self
}())

async function retry (awsFuction, errorMessage) {
  while (true) {
    try {
      return await awsFuction()
    } catch (err) {
      if (!err.retryable) {
        throw new URLProcessorError(errorMessage, err)
      }
    }
  }
}
