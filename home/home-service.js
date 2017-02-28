"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[4] || '').split(',')

var hapi       = require('hapi')
var chairo     = require('chairo')
var vision     = require('vision')
var inert      = require('inert')
var handlebars = require('handlebars')
var _          = require('lodash')
var moment     = require('moment')
var Seneca     = require('seneca')
var Rif        = require('rif')


var tag = 'home'

var server = new hapi.Server()
var rif = Rif()


var host = rif(HOST) || HOST


server.connection({
    port: PORT,
    host: host
})


server.register( vision )
server.register( inert )

server.register({
  register:chairo,
  options:{
    seneca: Seneca({
      tag: tag,
      internal: {logger: require('seneca-demo-logger')},
      debug: {short_logs:true}
    })
      //.use('zipkin-tracer', {sampling:1})
  }
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/{user}'},
    ],
    sneeze: {
      silent: true
    }
  }
})


server.views({
  engines: { html: handlebars },
  path: __dirname + '/www',
  layout: true
})


server.route({
  method: 'GET', path: '/{user}',
  handler: function( req, reply )
  {
    server.seneca.act(
      'timeline:list',
      {user:req.params.user},
      function( err, entrylist ) {
        if(err) {
          entrylist = []
        }

        reply.view('home',{
          user: req.params.user,
          entrylist: _.map(entrylist,function(entry){
            entry.when = moment(entry.when).fromNow()
            return entry
          })
        })
      })
  }
})


server.seneca.use('mesh',{
    host:host,
    bases:BASES,
    sneeze:{silent:true}
})


server.start(function(){
  console.log(tag,server.info.host,server.info.port)
})

