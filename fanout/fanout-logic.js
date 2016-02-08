'use strict'

var _ = require('lodash')

module.exports = function fanout (options) {
  var seneca = this

  seneca.add('info:entry', function(msg, done) {
    done()

    var entry = this.util.clean(msg)
    delete entry.fanout

    this.act('follow:list,kind:followers',{user:entry.user},function(err,userlist){
      seneca = this
      if(err) return done(err)

      seneca.act({
        timeline: 'insert',
        users: userlist,
      }, entry)
    })
  })
}
