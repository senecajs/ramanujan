// node base.js base0 39000 127.0.0.1:39000,127.0.0.1:39001
// node base.js base1 39001 127.0.0.1:39000,127.0.0.1:39001

var TAG = process.env.TAG || process.argv[2] || 'base'
var PORT = process.env.PORT || process.argv[3] || 39999
var HOST = process.env.HOST || process.argv[4] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[5] || '').split(',')

require('seneca')({
  tag: TAG,
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  //.test(console.log,'print')
  .use('zipkin-tracer', {sampling:1})
  .use('mesh',{
    isbase: true,
    port: PORT,
    host: HOST,
    bases: BASES,
    pin:'role:mesh',
    sneeze:{silent:false}
  })
  .ready(function(){
    console.log(this.id)
  })
