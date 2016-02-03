var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('search-logic')
  .use('mesh',{pin:'search:*', bases:BASES})
