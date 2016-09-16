module.exports = function entry_store (options) {
  var seneca = this

  seneca.add('store:save,kind:entry', function(msg, done) {
    this
      .make('entry',{
        when: msg.when,
        user: msg.user,
        text: msg.text
      })
    .save$(function(err, entry) {
      if(err) return done(err)

      this.act(
        {
          timeline: 'insert',
          users: [msg.user],
        },
        entry,
        function(err) {
          return done(err, entry)
        })
    })
  })

  seneca.add('store:list,kind:entry', function(msg, done) {
    this
      .make('entry')
      .list$( {user:msg.user}, function(err,list) {
        if(err) return done(err);

        list.reverse( function(a,b) {
          return a.when - b.when
        })

        done( null, list )
      })
  })
}
