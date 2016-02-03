var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('store-logic')
  .use('mesh',{pin:'store:*', bases:BASES})
