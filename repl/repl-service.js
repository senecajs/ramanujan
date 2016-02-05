var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('mesh',{
    tag:null,
    bases:BASES,
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
    sneeze:{silent:true}
  })
  .repl(10001)
