var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('post-logic')

  .add('role:api,cmd:ping', function(msg,done){
    done( null, {pong:true,api:true,time:Date.now()})
  })

  .use('mesh',{pins:['post:*','role:api'],bases:BASES})
  .repl(10001)
