var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'post',
  log: 'test',
  debug: {short_logs:true}
})
  .use('post-logic')

  .use('mesh',{
    pin: 'post:*',
    bases: BASES
  })
  .ready(function(){
    console.log(this.id)
  })
