"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

var hapi       = require('hapi')
var chairo     = require('chairo')
var vision     = require('vision')
var inert      = require('inert')
var handlebars = require('handlebars')


var server = new hapi.Server()

server.connection({ 
  port: PORT
})

server.register( vision )
server.register( inert )

server.register({
  register:chairo, 
  options:{tag:'index',log:'standard',debug:{undead:true}}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/'},
    ],
    sneeze: {
      silent: true
    }
  }
})

  
server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: __dirname + '/www',
    }
  }
})


server.views({
  engines: { html: handlebars },
  path: __dirname + '/www',
  layout: true
})


server.route({ 
  method: 'GET', path: '/', 
  handler: function( req, reply )
  {
    server.seneca.act(
      'timeline:list,all:true',
      function( err, entrylist ) {
        if(err) return done(err)

        reply.view('index',{entrylist:entrylist})
      })
  }
})


server.seneca.use('mesh',{bases:BASES})

server.start()

