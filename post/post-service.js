var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag: 'post',
  internal: {logger: require('seneca-demo-logger')},
  debug: { short_logs: true }
})
  .use('entity')
  .use('post-logic')
  .use('../transport-config/transport-config',{
    mesh: MESH,
    pin: 'post:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
