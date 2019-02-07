class URLProcessorError extends Error {
  constructor (message, innerError) {
    super(message)
    this.name = 'URLProcessorError'
    this.message = message
    this.innerError = innerError
  }

  toString () {
    return JSON.stringify(this, null, 4)
  }
}

module.exports = URLProcessorError
