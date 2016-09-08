var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'post',
  log: 'silent',
  debug: { short_logs: true }
})
  .use('demo-logger')
  .use('entity')
  .use('post-logic')

  .use('mesh',{
    pin: 'post:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
