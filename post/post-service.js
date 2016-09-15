var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'post',
  internal: {logger: require('seneca-demo-logger')},
  debug: { short_logs: true }
})
  .use('entity')
  .use('post-logic')
  .use('../transport-config/transport-config',{
    pin: 'post:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
