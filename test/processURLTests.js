/* eslint-disable no-undef */
const expect = require('chai').expect
const service = require('../processURL/service')
const sinon = require('sinon')

describe('service', function () {
  it('responds to slack message event by obtaining filename and stream URL from youtube-dl, saving that information to database and sending unfurl message to slack', async function () {
    const event = { channel: 'channelID', message_ts: 'timestamp', url: 'video_url' }
    const runner = {
      exec: sinon.fake.returns(`title
    https://www.example.com`)
    }
    const db = {
      saveVideoInfo: sinon.fake()
    }
    const net = {
      sendUnfurlMessage: sinon.fake()
    }
    await service(event, db, net, runner, 'base_url', 1549394033)
    expect(runner.exec.args[0]).to.deep.equal(['video_url'])
    expect(db.saveVideoInfo.args[0]).to.deep.equal(['channelID', 'timestamp', 'video_url', 'title.mp4', 'https://www.example.com'])
    expect(net.sendUnfurlMessage.args[0]).to.deep.equal(['channelID', 'timestamp', 'video_url', 'title.mp4', 'base_url'])
  })

  it('responds to cloudwatch timer event by refreshing cached stream urls that are older than 1 hour', async function () {
    const event = { source: 'aws.events' }
    const db = {
      getMessages: sinon.fake.returns([{ channel: 'channelID', message_ts: 'timestamp', video_url: 'video_url', last_updated: 1549394033 }]),
      saveVideoInfo: sinon.fake()
    }
    const runner = {
      exec: sinon.fake.returns(`title
    https://www.example.com`)
    }
    await service(event, db, null, runner, 'base_url', 1549394033 + 3601000)
    expect(db.getMessages.called).to.equal(true)
    expect(runner.exec.args[0]).to.deep.equal(['video_url'])
    expect(db.saveVideoInfo.args[0]).to.deep.equal(['channelID', 'timestamp', 'video_url', 'title.mp4', 'https://www.example.com'])
  })

  it('skips cached stream urls that are younger than 1 hour', async function () {
    const event = { source: 'aws.events' }
    const db = {
      getMessages: sinon.fake.returns([{ channel: 'channelID', message_ts: 'timestamp', video_url: 'video_url', last_updated: 1549394033 }]),
      saveVideoInfo: sinon.fake()
    }
    const runner = {
      exec: sinon.fake.returns(`title
    https://www.example.com`)
    }
    await service(event, db, null, runner, 'base_url', 1549394033 + 3000000)
    expect(db.getMessages.called).to.equal(true)
    expect(runner.exec.called).to.equal(false)
    expect(db.saveVideoInfo.called).to.equal(false)
  })
})
