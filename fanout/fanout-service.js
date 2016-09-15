var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag: 'fanout',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('fanout-logic')

  .use('../transport-config/transport-config',{
    mesh: MESH,
    listen:[
      {pin: 'fanout:*'},
      {pin: 'info:entry', model:'observe'}
    ],
    bases: BASES
  })

  .ready(function(){
    this.add('info:entry', function(msg,done){
      console.log('info:entry ricevuto da fanout')
      delete msg.info
      this.act('fanout:entry',msg,done)
    })

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

