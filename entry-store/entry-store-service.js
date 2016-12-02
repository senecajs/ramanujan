var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'entry-store',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs: true}
})
  .use('basic')
  .use('entity')
  .use('entry-store-logic')
  .use('mesh',{
    pin: 'store:*,kind:entry,cache:true',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
