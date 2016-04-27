'use strict'

var _ = require('lodash')

module.exports = function timeline (options) {
  var seneca = this


  seneca.add('timeline:insert', insert)
  seneca.add('timeline:list', list)


  function insert (msg, done) {
    var seneca = this
    done()

    var entry = {
      user: msg.user,
      text: msg.text,
      when: msg.when,
    }

    var users = _.clone(msg.users)
    var index = -1

    do_user()

    function do_user(err) {
      // try to complete the entire list, despite individual errors
      if( err ) {
        seneca.log.error(err)
      }

      ++index
      if( users.length <= index ) return

      insert_entry( users[index], true, do_user )
    }


    function insert_entry( user, create, next ) {
      seneca
        .make('timeline')
        .load$(user,function(err,timeline){
          if(err) return next(err)

          if( !timeline && create ) {
            seneca
              .make('timeline',{id$:user,entrylist:[]})
              .save$( function(err,timeline) {
                if( err && create ) return insert_entry( user, false, next )
                if( err ) return next(err)
                do_insert(timeline)
              })
          }
          else do_insert( timeline )

          function do_insert (timeline) {

            // insert is probabilistically idempotent
            for( var i = 0; i < Math.min(11,timeline.entrylist.length); ++i ) {
              if( entry.when === timeline.entrylist[i].when ) return next()
            }

            timeline.entrylist.push(entry)
            timeline.entrylist.sort(function(a,b){
              return b.when - a.when
            })

            timeline.save$(function(err,timeline) {
              // underlying data store may be able to indicate conflicts
              if( err && 'conflict' === err.code ) {
                return insert_entry( user, false, next )
              }
              if( err ) return next(err)
              next()
            })
          }
        })
    }
  }


  function list (msg, done) {
    this.act('follow:list,kind:following',{user:msg.user},function(err,following){
      if( err ) return done(err)

      this
        .make('timeline')
        .load$(msg.user,function(err,timeline){
          var entrylist = (timeline ? timeline.entrylist : [])
          _.each(entrylist,function(entry){
            entry.can_follow = 
              entry.user !== msg.user && 
              !_.includes(following,entry.user)
          })

          done(err,entrylist)
        })
    })
  }
}
