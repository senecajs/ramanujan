"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

var Hapi   = require('hapi')
var Chairo = require('chairo')
var Seneca = require('seneca')
var wozu   = require('wozu')

var server = new Hapi.Server()

server.connection({
  port: PORT
})

server.register({
  register: Chairo,
  options:{
    seneca: Seneca({
      tag: 'api',
      internal: {logger: require('seneca-demo-logger')},
      debug: {short_logs:true}
    })
    .use('zipkin-tracer', {sampling:1})
  }
})

server.register({
  register: wozu
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: server.wozu(),
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
      'post:entry',
      {user:req.params.user, text:req.payload.text},
      function(err,out) {
        if( err ) return reply.redirect('/error')

        reply.redirect(req.payload.from)
      }
    )}
})

server.route({
  method: 'POST', path: '/api/follow/{user}',
  handler: function( req, reply ){
    server.seneca.act(
      'follow:user',
      {user:req.params.user, target:req.payload.user},
      function(err,out) {
        if( err ) return reply.redirect('/error')

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

