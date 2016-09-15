var SHARD = process.env.SHARD || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

require('seneca')({
  tag: 'timeline'+SHARD,
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('entity')
  .use('timeline-logic')
  .use('../transport-config/transport-config', {
    //pin: 'timeline:*',
    pin: 'timeline:*,shard:'+SHARD,
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })


/* In Situ Test
  .repl(10002)

  .act("timeline:insert,user:foo,text:f0,when:1234,users:['aaa','bbb']")
  .act("timeline:insert,user:bar,text:f1,when:5678,users:['bbb','ccc']")

setTimeout( function() {
  si.act('timeline:list,user:aaa',console.log)
  si.act('timeline:list,user:bbb',console.log)
  si.act('timeline:list,user:ccc',console.log)
},333)
*/
