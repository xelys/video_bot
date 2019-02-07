const aws = require('aws-sdk')
var docClient = new aws.DynamoDB.DocumentClient()

exports.handler = async function (event) {
  const fileName = event['pathParameters']['file_name']
  const params = {
    TableName: 'messages',
    IndexName: 'messages_file_name_index',
    KeyConditionExpression: 'file_name = :file_name',
    ExpressionAttributeValues: {
      ':file_name': fileName
    },
    ProjectionExpression: 'stream_url'
  }
  const data = await docClient.query(params).promise()
  if (data.Items.length > 0) {
    const streamURL = data.Items[0].stream_url
    return {
      'isBase64Encoded': 'false',
      'statusCode': 301,
      'headers': { 'Content-Type': 'text/plain', 'Location': streamURL }
    }
  }
  return {
    'isBase64Encoded': 'false',
    'statusCode': 404,
    'headers': { 'Content-Type': 'application/json' },
    'body': JSON.stringify({ file_name: fileName })
  }
}
