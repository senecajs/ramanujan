var hapi       = require('hapi')
var chairo     = require('chairo')

var server = new hapi.Server()

server.connection({ 
  port: 8000 
})

server.register({
  register:chairo, 
  options:{log:'standard'}
})
  
server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: function( req, reply ){
    server.seneca.act(
      'role:api,cmd:ping',
      function(err,out){
        reply(err||out)
      })
  }})

server.seneca
  .add('role:api,cmd:ping', function(msg,done){
    done( null, {pong:true,time:Date.now()})
  })

server.start()

