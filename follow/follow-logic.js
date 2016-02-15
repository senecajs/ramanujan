var _ = require('lodash')

module.exports = function follow (options) {
  var seneca = this

  seneca.add('follow:user', function(msg, done) {
    var seneca = this
    done()

    relate( seneca, 'followers', msg.target, msg.user, 0, function(err) {
      if( err ) return;

      relate( seneca, 'following', msg.user, msg.target, 0, function(err) {
        if( err ) return;

        seneca.act('store:list,kind:entry',{user:msg.target}, function(err,list){
          if( err ) return;

          _.each(list,function(entry){
            seneca.act({
              timeline: 'insert',
              users: [msg.user],
            }, entry)
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
        list.unshift(msg.user)
        done(err, list)
      })
  })


  function relate(seneca,relation,from,to,count,done) {
    seneca
      .make('follow')
      .load$(from, function(err,follow){
        if( err ) return done(err)
        
        if( follow ) add_follower( null, follow )
        else {
          var follow = seneca.make('follow',{id$:from})
          follow[relation] = []
          follow.save$( add_follower )
        }

        function add_follower( err, follow ) {
          if( err ) {
            if( 1 < count ) {
              return done(err)
            }
            else {
              // operation is idempotent, so if create fails, try again
              return relate(seneca,relation,from,to,++count,done)
            }
          }

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
 
