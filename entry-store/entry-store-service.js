var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag: 'entry-store',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('basic')
  .use('entity')
  .use('entry-store-logic')
  .use('../transport-config/transport-config',{
    mesh: MESH,
    pin: 'store:*,kind:entry',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
