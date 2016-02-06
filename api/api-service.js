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
  options:{
    tag: 'api',
    //log: { map: [ {type: 'act', handler: 'print'} ] },
    log: 'standard',
    debug: {undead:true}}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/api/ping'},
        {path: '/api/post/{user}', method: 'post'},
        {path: '/api/follow/{user}', method: 'post'},
    ],
    sneeze: {
      silent: true
    }
  }
})


server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: function( req, reply ){
    server.seneca.act(
      'role:api,cmd:ping',
      function(err,out) {
        reply(err||out)
      }
  )}
})

server.route({ 
  method: 'POST', path: '/api/post/{user}', 
  handler: function( req, reply ){
    server.seneca.act(
      'post:text',
      {user:req.params.user, text:req.payload.text},
      function(err,out) {
        if( err ) reply.redirect('/error')

        reply.redirect(req.payload.from)
      }
    )}
})

server.route({ 
  method: 'POST', path: '/api/follow/{user}', 
  handler: function( req, reply ){
    server.seneca.act(
      'follow:user',
      {user:req.payload.user, follow:req.params.user},
      function(err,out) {
        if( err ) reply.redirect('/error')

        reply.redirect(req.payload.from)
      }
    )}
})

server.seneca
  .add('role:api,cmd:ping', function(msg,done){
    done( null, {pong:true,api:true,time:Date.now()})
  })

  .use('mesh',{bases:BASES})

server.start(function(){
  console.log('api',server.info.host,server.info.port)
})

