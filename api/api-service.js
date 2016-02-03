"use strict"

var PORT = process.env.PORT || process.argv[2] || 8001
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

var hapi       = require('hapi')
var chairo     = require('chairo')

var server = new hapi.Server()

server.connection({ 
  port: PORT
})

server.register({
  register:chairo, 
  options:{log:'standard'}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: { 
      path: '/api/ping', 
    },
    sneeze: {
      silent: false
    }
  }
})

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: function( req, reply ){
    server.seneca.act(
      'role:api,cmd:ping,default$:{}',
      function(err,out){
        reply(err||out)
      })
  }})

server.seneca.use('mesh',{bases:BASES})

server.start()

