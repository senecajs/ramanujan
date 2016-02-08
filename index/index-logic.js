
var _ = require('lodash')
var Memdown = require('memdown')
var Search  = require('search-index')

module.exports = function index (options) {
  var seneca = this
  var index

  seneca.add('search:query', function(msg, done) {
    var terms = msg.query.split(/ +/)

    index.search( {query:{text:terms}}, function(err,out) {
      var hits = (out && out.hits) || []
      hits = _.map(hits,function(hit){
        return hit.document
      })

      done(null,hits)
    })
  })


  seneca.add('search:insert', function(msg,done) {
    index.add([{
      id:msg.id,
      text:msg.text,
      user:msg.user,
      when:msg.when
    }], {}, done)
  })


  seneca.add( 'init:index', function(msg, done) {
    index = Search({
      db: Memdown
    })
    done()
  })
}
