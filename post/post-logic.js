module.exports = function post (options) {
  var seneca = this

  seneca.add('post:submit', function(msg, done) {
    console.log('POST:SUBMIT',msg.text)
    this.act('search:submit,default$:{}',{text:msg.text})
    done()
  })
}
