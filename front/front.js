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
    sneeze: {
      bases: BASES,
      silent: false
    }
  }
},console.log)

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: {
    wo: {}
  }
})

server.start(console.log)
