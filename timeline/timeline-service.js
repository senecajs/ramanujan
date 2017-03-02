var SHARD = process.env.SHARD || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[4] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'

require('seneca')({
  tag: 'timeline'+SHARD,
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('zipkin-tracer', {sampling:1})
  .use('entity')
  .use('timeline-logic')
  .use('mesh',{
    pin: 'timeline:*,shard:'+SHARD,
    bases: BASES,
    host: HOST,
    sneeze: {
      silent:JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  })

  .ready(function(){
    console.log(this.id)
  })
