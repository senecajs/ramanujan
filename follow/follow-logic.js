var _ = require('lodash')

module.exports = function follow (options) {
  var seneca = this

  seneca.add('follow:user', function(msg, done) {
    var seneca = this

    relate( seneca, 'followers', msg.target, msg.user, true, function(err) {
      if( err ) return done(err)

      relate( seneca, 'following', msg.user, msg.target, true, function(err) {
        if( err ) return done(err)

        seneca.act('store:list,kind:entry',{user:msg.target}, function(err,list) {
          if( err ) return done(err)

          _.each(list,function(entry){
            seneca.act({
              timeline: 'insert',
              users: [msg.user],
            }, entry.data$())
          })

          done()
        })
      })
    })
  })


  seneca.add('follow:list', function(msg,done){
    this
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
          add_follower( null, follow, done )
        }
        else if (create) {
          this.act('reserve:create', {key: 'follow/'+from}, function (err, status) {
            if( err ) return done(err)
            
            if( !status.ok ) {
              return relate(this,relation,from,to,false,done)
            }

            var follow = this.make('follow',{id$:from})
            follow[relation] = []
            add_follower(err, follow, function (err) {
              if( err ) return done(err)
              
              this.act('reserve:remove', {key: 'follow/'+from})
              done()
            })
          })
        }

        function add_follower( err, follow, done ) {
          if( err ) return done(err)

          follow[relation] = (follow[relation] || [])
          follow[relation].push(to)
          follow[relation] = _.uniq(follow[relation])

          follow.save$(done)
        }
      })
  }
}
 
