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


var server = new hapi.Server()

server.connection({ 
  port: PORT
})

server.register( vision )
server.register( inert )

server.register({
  register:chairo, 
  options:{tag:'search',log:'standard',debug:{undead:true}}
})

server.register({
  register: require('wo'),
  options:{
    bases: BASES,
    route: [
        {method: ['GET','POST'], path: '/search/{user}'},
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
  method: ['GET','POST'], 
  path: '/search/{user}', 
  handler: function( req, reply )
  {
    var query 
      = (req.query ? (null == req.query.query ? '' : ' '+req.query.query) : '')
      + (req.payload ? (null == req.payload.query ? '' : ' '+req.payload.query) : '')

    query = query.replace(/^ +/,'')
    query = query.replace(/ +$/,'')

    server.seneca.act(
      'search:query',
      {query: query },
      function( err, entrylist ) {
        if(err) {
          this.log.warn(err)
          entrylist = []
        }

        reply.view('search',{
          query: encodeURIComponent(query),
          user: req.params.user,
          entrylist: _.map(entrylist,function(entry){
            entry.when = moment(entry.when).fromNow()
            return entry
          })
        })
      })
  }
})


server.seneca.use('mesh',{bases:BASES})

server.start(function(){
  console.log('search',server.info.uri)
})

