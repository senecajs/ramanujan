"use strict"

var BASES = (process.env.BASES || process.argv[2] || '').split(',')

var hapi = require('hapi')
var server = new hapi.Server()

server.connection({ 
  port: 8000 // test with http://localhost:8000/api/ping
})

server.register({
  register: require('wo'),
  options: {
    bases: BASES,
    sneeze: {
      silent: false
    }
  }
})

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: {
    wo: {}
  }
})

server.route({ 
  method: 'POST', path: '/api/post', 
  handler: {
    wo: {}
  }
})

server.start(function(){
  console.log('started',server.info.uri)
})
