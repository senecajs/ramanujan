var _ = require('lodash')

module.exports = function post (options) {
  var seneca = this

  function relate(seneca,relation,from,to,done) {
    seneca
      .make('follow')
      .load$(from, function(err,follow){
        if( err ) return done(err)
        
        if( follow ) add_follower( null, follow )
        else {
          var follow = this.make('follow',{id$:from})
          follow[relation] = []
          follow.save$( add_follower )
        }

        function add_follower( err, follow ) {
          if( err ) return done(err)

          follow[relation] = _.uniq(follow[relation].push(to))
          follow.save$(function(err){
            done(err)
          })
        }
      })
  }

  seneca.add('follow:user', function(msg, done) {
    var seneca = this
    done()
    relate( seneca, 'followers', msg.follow, msg.user, function(err) {
      if( err ) return;

      relate( seneca, 'following', msg.user, msg.follow, done)
    })
  })
}
