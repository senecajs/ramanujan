var REPL_PORT = parseInt(process.env.REPL_PORT || process.argv[2] || 10001)
var HOST = process.env.HOST || process.argv[3] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[4] || '').split(',')


console.log( require('os').networkInterfaces() )
//console.log( HOST, require('rif')()(HOST) )


var repl = require('seneca-repl');

var seneca = require('seneca')({
  tag: 'repl',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
.use('zipkin-tracer', {sampling:1})
.use('mesh',{
  tag: null, // ensures membership of all tagged meshes
  host: HOST,
  bases: BASES,
  make_entry: function( entry ) {
    if( 'wo' === entry.tag$ ) {
      return {
        route: JSON.stringify(entry.route),
        host: entry.host,
        port: entry.port,
        identifier: entry.identifier$
      }
    }
  },
    sneeze:{silent:false}
})
.use(repl)
.ready(function () {
  seneca.repl({
    port: REPL_PORT,
    alias: {
      m: 'role:mesh,get:members'
    }
  })
})
