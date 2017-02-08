var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'post',
  internal: {logger: require('seneca-demo-logger')},
  debug: { short_logs: true }
})
  .use('zipkin-tracer', {sampling:1})
  .use('entity')
  .use('post-logic')

  .use('mesh',{
    pin: 'post:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
