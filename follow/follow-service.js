var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'post',
  debug:{undead:true}
})
  .use('follow-logic')
  .use('mesh',{pin:'follow:*',bases:BASES,sneeze:{silent:true}})
  .repl(10002)
