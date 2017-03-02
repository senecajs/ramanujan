"use strict"

var PORT = process.env.PORT || process.argv[2] || 0
var HOST = process.env.HOST || process.argv[3] || 0
var BASES = (process.env.BASES || process.argv[4] || '').split(',')
var SILENT = process.env.SILENT || process.argv[5] || 'true'

var hapi       = require('hapi')
var chairo     = require('chairo')
var vision     = require('vision')
var inert      = require('inert')
var handlebars = require('handlebars')
var _          = require('lodash')
var moment     = require('moment')
var Seneca     = require('seneca')
var Rif        = require('rif')


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
      tag: 'mine',
      internal: {logger: require('seneca-demo-logger')},
      debug: {short_logs:true}
    })
      //.use('zipkin-tracer', {sampling:1})
      .use('entity')
  }
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {path: '/mine/{user}'},
    ],
    sneeze: {
      host: host,
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
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
      function( err, entrylist ) {
        if(err) {
          entrylist = []
        }

        reply.view('mine',{
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
    bases:BASES,
    host:host
})

server.start(function(){
  console.log('mine',server.info.host,server.info.port)
})


