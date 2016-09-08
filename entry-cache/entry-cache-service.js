var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'entry-cache',
  log: 'silent',
  debug: {short_logs:true}
})
  .use('demo-logger')
  .use('entry-cache-logic')
  .use('mesh',{
    pin: 'store:list,kind:entry,cache:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
