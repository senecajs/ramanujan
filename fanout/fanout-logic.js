'use strict'

var _ = require('lodash')

module.exports = function fanout (options) {
  var seneca = this

  seneca.add('fanout:entry', function(msg, done) {
    done()

    var entry = this.util.clean(msg)
    delete entry.fanout

    this.act('follow:list,kind:followers',{user:entry.user},function(err,userlist){
      if(err) return done(err)

      if( userlist ) {
        this.act({
          timeline: 'insert',
          users: userlist,
        }, entry)
      }
    })
  })
}
