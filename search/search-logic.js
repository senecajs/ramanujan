module.exports = function post (options) {
  var seneca = this

  seneca.add('search:submit', function(msg, done) {
    console.log('SEARCH:SUBMIT',msg.text)
    done()
  })
}
