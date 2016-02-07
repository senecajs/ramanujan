'use strict'

var _ = require('lodash')

module.exports = function fanout (options) {
  var seneca = this

  seneca.add('fanout:text', function(msg, done) {
    done()

    var entry = this.util.clean(msg)
    delete entry.fanout

    this.act('follow:list',{user:entry.user},function(err,userlist){
      seneca = this
      if(err) return done(err)

      var shards = [[],[]]

      _.each(userlist,function(user){
        shards[resolve_shard(user)].push(user)
      })

      _.each(shards,function(users,shard){
        seneca.act({
          timeline: 'insert',
          kind: 'entry',
          shard: shard,
          users: users,
        }, entry)
      })
    })
  })

  function resolve_shard(user) {
    return user.charCodeAt(0) % 2
  }
}
