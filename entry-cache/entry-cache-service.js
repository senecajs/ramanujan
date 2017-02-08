var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'entry-cache',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('zipkin-tracer', {sampling:1})
  .use('basic')
  .use('entity')
  .use('entry-cache-logic')
  .use('mesh',{
    pin: 'store:*,kind:entry',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
