module.exports = async function service (event, verifySignature, db, invoke, signingKey) {
  if (!event) {
    return 400
  }
  if (!verifySignature(event, signingKey)) {
    return 403
  }

  if (event.parsedBody.type === 'url_verification') {
    return { 'challenge': event.parsedBody.challenge }
  }

  const slackEvent = event.parsedBody.event

  switch (slackEvent.type) {
    case 'link_shared':
      await invoke(slackEvent.channel, slackEvent.message_ts, slackEvent.links[0].url)
      break
    case 'message':
      if (slackEvent.subtype === 'message_deleted') {
        await db.deleteMessage(slackEvent.channel, slackEvent.deleted_ts)
      }
      break
  }
  return 'OK'
}
