var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'reserve',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs: true}
})
  .use('reserve-logic')
  .use('mesh',{
    pin: 'reserve:*',
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })
