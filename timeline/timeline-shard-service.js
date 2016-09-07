var BASES = (process.env.BASES || process.argv[2] || '').split(',')

var _ = require('lodash')

function resolve_shard(user) {
  return user.charCodeAt(0) % 2
}

require('seneca')({
  tag: 'timeline-shard',
  log: 'silent',
  legacy: { logging: false },
  debug: {short_logs:true}
})

  .use('demo-logger')

  .add('timeline:list',function(msg,done){
    var shard = resolve_shard(msg.user)
    this.act({shard:shard},msg,done)
  })

  .add('timeline:insert',function(msg,done){
    var seneca = this
    done()

    var shards = [[],[]]

    _.each(msg.users,function(user){
      shards[resolve_shard(user)].push(user)
    })

    _.each(shards,function(users,shard){
      if( 0 < users.length ) {
        seneca.act({
          shard: shard,
          users: users,
        }, msg)
      }
    })
  })

  .use('mesh',{
    pin: 'timeline:*',
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })


/* In Situ Test
  .repl(10002)

  .ready( function(){
    var si = this

    si.act("timeline:insert,user:foo,text:f0,when:1234,users:['aaa','bbb']")
    si.act("timeline:insert,user:bar,text:f1,when:5678,users:['bbb','ccc']")

    setTimeout( function() {
      si.act('timeline:list,user:aaa',function(e,o){console.log('aaa',o)})
      si.act('timeline:list,user:bbb',function(e,o){console.log('bbb',o)})
      si.act('timeline:list,user:ccc',function(e,o){console.log('ccc',o)})
    },333)
  })
*/
