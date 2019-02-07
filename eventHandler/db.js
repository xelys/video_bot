const SlackEventHandlerError = require('./error')
const aws = require('aws-sdk')
var docClient = new aws.DynamoDB.DocumentClient()

module.exports = (function db () {
  const self = {}
  self.deleteMessage = async function (channel, deletedTimestamp) {
    var params = {
      'Key': {
        'channel': channel,
        'message_ts': deletedTimestamp
      },
      'TableName': 'messages'
    }
    await retry(() => docClient.delete(params).promise(), 'Error deleting message')
  }
  return self
}())

async function retry (awsFuction, errorMessage) {
  while (true) {
    try {
      await awsFuction()
      return
    } catch (err) {
      if (!err.retryable) {
        throw new SlackEventHandlerError(errorMessage, err)
      }
    }
  }
}
