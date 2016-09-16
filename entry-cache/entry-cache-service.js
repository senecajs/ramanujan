var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag:'entry-cache',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('entry-cache-logic')
  .use('../transport-config/transport-config', {
    mesh: MESH,
    pin: 'store:list,kind:entry,cache:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
