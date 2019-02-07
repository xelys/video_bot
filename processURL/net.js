const url = require('url')
const { request } = require('https')

module.exports = (function () {
  const self = {}
  self.sendUnfurlMessage = function (channel, messageTimestamp, url, fileName, baseURL) {
    const message = {
      'channel': channel,
      'ts': messageTimestamp,
      'unfurls': {
        [url]: {
          'fallback': baseURL + fileName,
          'actions': [
            {
              'type': 'button',
              'text': fileName,
              'url': baseURL + fileName
            }
          ]
        }
      }
    }
    return sendRequest('https://slack.com/api/chat.unfurl', JSON.stringify(message))
  }
  return self
}())

function sendRequest (responseURL, postData) {
  return new Promise((resolve, reject) => {
    const parsedURL = new url.URL(responseURL)
    var options = {
      hostname: parsedURL.hostname,
      port: parsedURL.port,
      path: parsedURL.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': postData.length
      }
    }
    options.headers['Authorization'] = 'Bearer ' + process.env.OAUTH_TOKEN
    var req = request(options, (res) => {
      console.log('status: ', res.statusCode, res.statusMessage)
      resolve(res)
    })
    req.on('error', (e) => {
      console.log('error: ', e)
      reject(e)
    })
    req.write(postData)
    req.end()
  })
}
