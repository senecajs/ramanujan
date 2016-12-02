'use strict'

var _ = require('lodash')

module.exports = function entry_cache (options) {
  var seneca = this

  var cache = {}

  seneca.add('store:save,kind:entry', function(msg, done) {
    delete cache[msg.user]
    msg.cache = true
    this.act(msg, done)
  })


  seneca.add('store:list,kind:entry', function(msg, done) {
    if( cache[msg.user] ) {
      return done( null, cache[msg.user] )
    }

    msg.cache = true

    this.act(msg, function(err,list){
      if(err) return done(err)
      cache[msg.user] = list
      done(null,list)
    })
  })
}
