module.exports = function post (options) {
  var seneca = this

  seneca.add('post:submit', function(msg, done) {
    var entry = this.util.clean(msg)
    delete entry.post
    console.log('POST:SUBMIT',entry)

    this.act('store:save,kind:entry',entry)
    this.act('search:index',entry)
    done()
  })
}
