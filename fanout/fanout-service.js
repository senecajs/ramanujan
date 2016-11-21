var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'fanout',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs: true}
})
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
