const url = require('url')
const URLProcessorError = require('./error')

module.exports = function parseYoutubeDLOutput (output) {
  const outputLines = output.split('\n')
  if (outputLines.length < 2) {
    throw new URLProcessorError('Invalid youtube-dl output')
  }
  const title = outputLines[0].trim()
  const streamUrl = outputLines[1].trim()
  try {
    // eslint-disable-next-line no-new
    new url.URL(streamUrl)
  } catch (err) {
    throw new URLProcessorError('Invalid stream url', err)
  }
  const fileName = title.replace(/[^a-zA-Z0-9_]+/g, '_') + '.mp4'
  if (fileName.length === 0) {
    throw new URLProcessorError('Invalid filename')
  }
  return { fileName, streamUrl }
}
