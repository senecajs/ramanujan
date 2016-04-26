var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'post',
  log: 'test',
  debug: {short_logs:true}
})
  .use('entity')
  .use('post-logic')

  .use('mesh',{
    pin: 'post:*',
    bases: BASES,
    balance_client: {
      debug: {client_updates:false}
    }
  })
  .ready(function(){
    console.log(this.id)
  })
