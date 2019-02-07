const { execFileSync } = require('child_process')
const { copyFileSync, existsSync } = require('fs')
const { execFile } = require('child_process')
const URLProcessorError = require('./error')

module.exports = (function () {
  const self = {}

  self.exec = async function (videoURL) {
    if (!existsSync('/tmp/youtube-dl')) {
      copyFileSync('./youtube-dl', '/tmp/youtube-dl')
    }
    execFileSync('chmod', ['a+rx', '/tmp/youtube-dl'])
    return new Promise((resolve, reject) => {
      execFile('/tmp/youtube-dl', ['-g', '-e', '-f', 'best[height<=720]', videoURL], (error, stdout, stderr) => {
        if (error) {
          reject(new URLProcessorError(stderr, error))
        } else {
          const output = stdout.toString('utf8')
          resolve(output)
        }
      })
    })
  }
  return self
})()
