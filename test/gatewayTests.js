/* eslint-disable no-undef */
const expect = require('chai').expect
const gateway = require('../eventHandler/gateway')

describe('parseEvent()', function () {
  it('extracts relevant information from API gateway event', function () {
    const event = {
      headers: {
        'X-Slack-Request-Timestamp': 'test_timestamp',
        'X-Slack-Signature': 'test_signature'
      },
      body: '{"test": "test"}'
    }
    const result = gateway.parseEvent(event)
    expect(result).to.deep.equal({
      body: '{"test": "test"}',
      timestamp: 'test_timestamp',
      signature: 'test_signature',
      parsedBody: { test: 'test' }
    })
  })

  it('returns false if JSON in body can\'t be parsed', function () {
    const event = {
      headers: {
        'X-Slack-Request-Timestamp': 'test_timestamp',
        'X-Slack-Signature': 'test_signature'
      },
      body: 'test'
    }
    const result = gateway.parseEvent(event)
    expect(result).to.equal(false)
  })

  it('returns false if required headers are missing', function () {
    const event = {
      headers: {
        'X-Slack-Request-Timestamp': 'test_timestamp'
      },
      body: '{"test": "test"}'
    }
    const result = gateway.parseEvent(event)
    expect(result).to.equal(false)
  })

  it('returns false if required headers are missing', function () {
    const event = {
      headers: {
        'X-Slack-Signature': 'test_signature'
      },
      body: '{"test": "test"}'
    }
    const result = gateway.parseEvent(event)
    expect(result).to.equal(false)
  })
})

describe('toResponse()', function () {
  it('converts response to API Gateway format', function () {
    const response = { test: 'test' }
    const result = gateway.toResponse(response)
    expect(result).to.deep.equal({
      'isBase64Encoded': 'false',
      'statusCode': 200,
      'headers': { 'Content-Type': 'application/json' },
      'body': '{"test":"test"}'
    })
  })

  it('converts error codes to API Gateway errors', function () {
    expect(gateway.toResponse(400)).to.deep.equal({
      'isBase64Encoded': 'false',
      'statusCode': 400
    })
  })
})
