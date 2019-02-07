/* eslint-disable no-undef */
const { createHmac } = require('crypto')
const expect = require('chai').expect
const verifySignature = require('../eventHandler/verifySignature')

describe('verifySignature()', function () {
  it('checks that signature matches timestamp and body', function () {
    const input = {
      body: '{"test": "test"}',
      timestamp: 'test_timestamp',
      signature: 'v0=' + createHmac('sha256', 'secret').update('v0:test_timestamp:{"test": "test"}').digest('hex'),
      parsedBody: { test: 'test' }
    }
    const result = verifySignature(input, 'secret')
    expect(result).to.equal(true)
  })
})
