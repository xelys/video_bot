const parseYoutubeDLOutput = require('./parseYoutubeDLOutput')

module.exports = async function service (event, db, net, youtubeDLRunner, baseURL, currentTime) {
  async function processNewURL (event) {
    const youtubeDLOutput = await youtubeDLRunner.exec(event.url)
    const { fileName, streamUrl } = parseYoutubeDLOutput(youtubeDLOutput)
    await db.saveVideoInfo(event.channel, event.message_ts, event.url, fileName, streamUrl)
    await net.sendUnfurlMessage(event.channel, event.message_ts, event.url, fileName, baseURL)
  }

  async function updateStaleURLs () {
    let counter = 0
    const messages = await db.getMessages()
    for (let message of messages) {
      const secondsSinceLastUpdate = (currentTime - message.last_updated) / 1000
      console.log('Video ' + message.file_name + ' last updated ' + secondsSinceLastUpdate + ' seconds ago')
      if (secondsSinceLastUpdate > 3600) {
        console.log('Now updating video ' + message.file_name)
        const youtubeDLOutput = await youtubeDLRunner.exec(message.video_url)
        const { fileName, streamUrl } = parseYoutubeDLOutput(youtubeDLOutput)
        await db.saveVideoInfo(message.channel, message.message_ts, message.video_url, fileName, streamUrl)
        console.log('Video ' + message.file_name + ' updated successfully')
        counter++
      }
    }
    console.log(counter + ' videos updated')
  }

  if (typeof event.url === 'string' && event.url.length > 0) {
    await processNewURL(event)
  } else if (event.source === 'aws.events') {
    await updateStaleURLs()
  }
}
