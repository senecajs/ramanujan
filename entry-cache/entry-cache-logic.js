'use strict'

var _ = require('lodash')

module.exports = function entry_cache (options) {
  var seneca = this

  var cache = {}

  seneca.add('store:list,kind:entry,cache:true', function(msg, done) {
    if( cache[msg.user] ) {
      console.log('HIT',msg.user)
      return done( null, cache[msg.user] )
    }
    delete msg.cache
    this.act(msg, function(err,list){
      if(err) return done(err)
      cache[msg.user] = list
      done(null,list)
    })
  })

  
  seneca.add('info:entry', function(msg, done) {
    delete cache[msg.user]
    done()
  })

}
