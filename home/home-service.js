"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

var hapi       = require('hapi')
var chairo     = require('chairo')
var vision     = require('vision')
var inert      = require('inert')
var handlebars = require('handlebars')
var _          = require('lodash')
var moment     = require('moment')
var Seneca     = require('seneca')
var wozu       = require('wozu')


var tag = 'home'

var server = new hapi.Server()

server.connection({
  port: PORT
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
      .use('zipkin-tracer', {sampling:1})
  }
})

server.register({
  register: wozu
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

server.seneca.use('mesh',{bases:BASES})

server.start(function(){
  console.log(tag,server.info.host,server.info.port)
})

