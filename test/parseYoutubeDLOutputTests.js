/* eslint-disable no-undef */
const expect = require('chai').expect
const parseYoutubeDLOutput = require('../processURL/parseYoutubeDLOutput')
const URLProcessorError = require('../processURL/error')

describe('parseYoutubeDLOutput', function () {
  it('Parses output of youtubeDL executable and converts it into filename and stream URL', function () {
    const output = `test%$&%$+=title
                    https://www.youtube.com`
    const { fileName, streamUrl } = parseYoutubeDLOutput(output)
    expect(fileName).to.equal('test_title.mp4')
    expect(streamUrl).to.equal('https://www.youtube.com')
  })

  it('Throws an exception if output contains less than 2 lines', function () {
    const output = 'test title'
    expect(parseYoutubeDLOutput.bind(null, output)).to.throw(URLProcessorError)
  })

  it('Throws an exception if second line of output is not a valid URL', function () {
    const output = `test title
    invalid_url`
    expect(parseYoutubeDLOutput.bind(null, output)).to.throw(URLProcessorError)
  })
})
