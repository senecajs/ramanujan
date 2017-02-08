var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'follow',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs: true}
})
  .use('zipkin-tracer', {sampling:1})
  .use('entity')
  .use('follow-logic')
  .use('mesh',{
    pin: 'follow:*',
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })
