var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'entry-store',
  log: 'silent',
  legacy: { logging: false },
  debug: {short_logs:true}
})
  .use('demo-logger')
  .use('basic')
  .use('entity')
  .use('entry-store-logic')
  .use('mesh',{
    pin: 'store:*,kind:entry',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
