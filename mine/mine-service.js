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
  options:{tag:'mine',log:'standard',debug:{undead:true}}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/mine/{user}'},
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
  method: 'GET', path: '/mine/{user}', 
  handler: function( req, reply )
  {
    server.seneca.act(
      'store:list,kind:entry',
      {user:req.params.user},
      function( err, list ) {
        if(err) return done(err)

        reply.view('mine',{entrylist:list})
      })
  }
})


server.seneca.use('mesh',{bases:BASES})

server.start()

