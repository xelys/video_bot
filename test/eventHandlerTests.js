/* eslint-disable no-undef */
const expect = require('chai').expect
const sinon = require('sinon')
const service = require('../eventHandler/service')

describe('service()', function () {
  it('responds to url_verification challenge with correct response', async function () {
    const event = {
      parsedBody: { type: 'url_verification', challenge: 'test_challenge' }
    }
    const verifySignature = sinon.fake.returns(true)
    const invoke = sinon.fake()
    const db = {
      deleteMessage: sinon.fake()
    }
    const result = await service(event, verifySignature, db, invoke, 'secret')
    expect(verifySignature.called).to.equal(true)
    expect(result).to.be.deep.equal({ 'challenge': 'test_challenge' })
  })

  it('calls invoke when called with link_shared event', async function () {
    const event = {
      body: '{"test": "test"}',
      timestamp: 'test_timestamp',
      signature: 'test_signature',
      parsedBody: { event: { type: 'link_shared', channel: 'channel', message_ts: 'message_ts', links: [{ url: 'url' }] } }
    }
    const verifySignature = sinon.fake.returns(true)
    const invoke = sinon.fake()
    const db = {
      deleteMessage: sinon.fake()
    }
    const result = await service(event, verifySignature, db, invoke, 'secret')
    expect(verifySignature.called).to.equal(true)
    expect(invoke.called).to.equal(true)
    expect(invoke.args[0]).to.deep.equal(['channel', 'message_ts', 'url'])
    expect(result).to.be.equal('OK')
  })

  it('calls deleteMessage when called with message_deleted event', async function () {
    const event = {
      body: '{"test": "test"}',
      timestamp: 'test_timestamp',
      signature: 'test_signature',
      parsedBody: { event: { type: 'message', subtype: 'message_deleted', channel: 'channel', deleted_ts: 'deleted_ts' } }
    }
    const verifySignature = sinon.fake.returns(true)
    const invoke = sinon.fake()
    const db = {
      deleteMessage: sinon.fake()
    }
    const result = await service(event, verifySignature, db, invoke, 'secret')
    expect(verifySignature.called).to.equal(true)
    expect(invoke.called).to.equal(false)
    expect(db.deleteMessage.called).to.equal(true)
    expect(db.deleteMessage.args[0]).to.deep.equal(['channel', 'deleted_ts'])
    expect(result).to.be.equal('OK')
  })
})
