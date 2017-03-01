var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

require('seneca')({
  tag: 'fanout',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs: true}
})
  .use('zipkin-tracer', {sampling:1})
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
      bases: BASES,
      host: HOST
  })

  .ready(function(){
    console.log(this.id)
  })
