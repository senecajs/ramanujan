var REPL_PORT = parseInt(process.env.REPL_PORT || process.argv[2] || 10001)
var BASES = (process.env.BASES || process.argv[3] || '').split(',')

require('seneca')({
  tag: 'repl',
  log: { level: 'none' },
  internal: { logger: require('seneca-demo-logger') },
  debug: {short_logs:true}
})
  .use('mesh',{
    tag: null, // ensures membership of all tagged meshes
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
    }
  })
  .repl({
    port: REPL_PORT,
    alias: {
      m: 'role:mesh,get:members'      
    }
  })
