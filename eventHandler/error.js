class SlackEventHandlerError extends Error {
  constructor (message, innerError) {
    super(message)
    this.name = 'SlackEventHandlerError'
    this.innerError = innerError
  }

  toString () {
    return JSON.stringify(this, null, 4)
  }
}

module.exports = SlackEventHandlerError
