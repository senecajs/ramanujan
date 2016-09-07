var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'fanout',
  log: 'silent',
  legacy: { logging: false },
  debug: {short_logs:true}
})
  .use('demo-logger')
  .use('fanout-logic')

  .add('info:entry', function(msg,done){
    delete msg.info
    this.act('fanout:entry',msg,done)
  })

  .use('mesh',{
    listen:[
      {pin: 'fanout:*'},
      {pin: 'info:entry', model:'observe'}
    ],
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })


/* In Situ Testing

  .add('follow:list', function(msg,done){
    done(null,['bar','car','dar','ear'])
  })

  .add('timeline:insert',function(msg,done){
    console.log('INSERT',msg)
    done()
  })

  .act('info:entry,user:foo,text:f0,when:1234')
*/

