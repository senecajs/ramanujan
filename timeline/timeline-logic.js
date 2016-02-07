'use strict'

var _ = require('lodash')

module.exports = function timeline (options) {
  var seneca = this


  seneca.add('timeline:insert', function(msg, done) {
    var seneca = this
    done()

    var entry = {
      user: msg.user,
      text: msg.text,
      when: msg.when,
    }

    var users = _.clone(msg.users)
    console.log('users',users)

    do_user(0)

    function do_user(count) {
      count = count || 0
      var user = users.shift()
      if( !user) return;

      console.log('user',user)

      seneca
        .make('timeline')
        .load$(user,function(err,timeline){
          if(err) return setImmediate(do_user)

          if( !timeline ) {
            seneca
              .make('timeline',{id$:user,entrylist:[]})
              .save$( insert_entry )
          }
          else insert_entry( null, timeline )

          function insert_entry(err,timeline) {
            if(err) {
              if( 1 < count ) {
                return do_user(0)
              }
              else {
                // if create failed, try again, as now exists
                users.unshift(user)
                return do_user(count)
              }
            }
            
            timeline.entrylist.unshift(entry)            
            console.log('timeline',timeline)
            timeline.save$(do_user)
          }
        })
    }
  })


  seneca.add('timeline:list', function(msg, done) {
    this
      .make('timeline')
      .load$(msg.user,function(err,timeline){
        done( err, timeline ? timeline.entrylist : [] )
      })
  })
}
