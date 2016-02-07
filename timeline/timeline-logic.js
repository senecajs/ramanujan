'use strict'

var _ = require('lodash')

module.exports = function fanout (options) {
  var seneca = this


  seneca.add('timeline:insert', function(msg, done) {
    var seneca = this
    done()

    var entry = {
      user: msg.user,
      test: msg.text,
      when: msg.when,
    }

    var users = _.clone(msg.users)

    function do_user() {
      var user = users.shift()
      if( !user) return;

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
            if(err) return setImmediate(do_user)
            
            timeline.entrylist.unshift(entry)            
            timeline.save$(do_user)
          }
        })
    }

    do_user()
  })


  seneca.add('timeline:list', function(msg, done) {
    this
      .make('timeline')
      .load$(msg.user,function(err,timeline){
        done( err, timeline ? timeline.entrylist : [] )
      })
  })
}
