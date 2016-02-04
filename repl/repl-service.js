var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('mesh',{bases:BASES})
  .repl(10001)
