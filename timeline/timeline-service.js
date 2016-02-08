var SHARD = process.env.SHARD || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

require('seneca')({tag:'timeline'+SHARD,debug:{undead:true}})
  .use('timeline-logic')
  .use('mesh',{pin:'timeline:*,shard:'+SHARD,bases:BASES,sneeze:{silent:true}})


/*
  .repl(10002)

  .act("timeline:insert,user:foo,text:f0,when:1234,users:['aaa','bbb']")
  .act("timeline:insert,user:bar,text:f1,when:5678,users:['bbb','ccc']")

setTimeout( function() {
  si.act('timeline:list,user:aaa',console.log)
  si.act('timeline:list,user:bbb',console.log)
  si.act('timeline:list,user:ccc',console.log)
},333)
*/
