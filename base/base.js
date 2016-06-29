// node base.js base0 39000 127.0.0.1:39000,127.0.0.1:39001
// node base.js base1 39001 127.0.0.1:39000,127.0.0.1:39001

var TAG = process.env.TAG || process.argv[2] || 'base'
var PORT = process.env.PORT || process.argv[3] || 39999
var BASES = (process.env.BASES || process.argv[4] || '').split(',')

require('seneca')({
  tag: TAG,
  log: { level: 'none' },
  internal: { logger: require('seneca-demo-logger') },
  debug: {short_logs:true}
})
  .use('mesh',{
    isbase: true, 
    port: PORT, 
    bases: BASES,
    pin:'role:mesh'
  })
  .ready(function(){
    console.log(this.id)
  })
