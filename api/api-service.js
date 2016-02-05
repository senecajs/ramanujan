"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

var hapi       = require('hapi')
var chairo     = require('chairo')

var server = new hapi.Server()

server.connection({ 
  port: PORT
})

server.register({
  register:chairo, 
  options:{tag:'api',log:'standard',debug:{undead:true}}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/api/ping'},
        {path: '/api/post', method: 'post'},
    ],
    sneeze: {
      silent: true
    }
  }
})

function passon(reply) {
  return function(err,out) {
    reply(err||out)
  }
}

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: function( req, reply ){
    server.seneca.act(
      'role:api,cmd:ping,default$:{}',
      passon(reply)
  )}
})

server.route({ 
  method: 'POST', path: '/api/post', 
  handler: function( req, reply ){
    server.seneca.act(
      'post:submit',
      {user:req.payload.user, text:req.payload.text},
      passon(reply)
    )}
})

server.seneca.use('mesh',{bases:BASES})

server.start()

