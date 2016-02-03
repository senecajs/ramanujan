module.exports = function post (options) {
  var seneca = this

  seneca.add('store:save', function(msg, done) {
    console.log('STORE:SAVE',msg.text)
    done()
  })
}
