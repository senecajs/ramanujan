module.exports = function post (options) {
  var seneca = this

  seneca.add('store:save,kind:entry', function(msg, done) {
    this
      .make('entry',{
        when: msg.when,
        user: msg.user,
        text: msg.text
      })
    .save$(done)
  })

  seneca.add('store:list,kind:entry', function(msg, done) {
    this
      .make('entry')
      .list$( function(err,list) {
        if(err) return done(err);

        list.reverse( function(a,b) {
          return a.when - b.when
        })

        done( null, list )
      })
  })
}
