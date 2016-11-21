var _ = require('lodash')

module.exports = function follow (options) {
  var seneca = this

  seneca.add('follow:user', function(msg, done) {
    var seneca = this
    done()

    relate( seneca, 'followers', msg.target, msg.user, true, function(err) {
      if( err ) return;

      relate( seneca, 'following', msg.user, msg.target, true, function(err) {
        if( err ) return;

        seneca.act('store:list,kind:entry',{user:msg.target}, function(err,list) {
          if( err ) return;

          _.each(list,function(entry){
            seneca.act({
              timeline: 'insert',
              users: [msg.user],
            }, entry.data$())
          })
        })
      })
    })
  })


  seneca.add('follow:list', function(msg,done){
    seneca
      .make('follow')
      .load$(msg.user, function(err,follow){
        var list = (follow && follow[msg.kind]) || []
        done(err, list)
      })
  })


  function relate(seneca,relation,from,to,create,done) {
    seneca
      .make('follow')
      .load$(from, function(err, follow) {
        if( err ) return done(err)
        
        if (follow) {
          add_follower( null, follow )
        }
        else if (create) {
          this.act('reserve:create', {key: 'follow/'+from}, function (err, status) {
            if( err ) return done(err)
            
            if( !status.ok ) {
              return relate(this,relation,from,to,false,done)
            }

            var follow = this.make('follow',{id$:from})
            follow[relation] = []
            follow.save$( add_follower, function (err) {
              if( err ) return done(err)

              this.act('reserve:remove', {key: 'follow/'+from})
            })
          })
        }

        function add_follower( err, follow ) {
          if( err ) return done(err)

          follow[relation] = (follow[relation] || [])
          follow[relation].push(to)
          follow[relation] = _.uniq(follow[relation])

          follow.save$(function(err){
            done(err)
          })
        }
      })
  }
}
 
