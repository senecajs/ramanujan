var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')()
  .use('entry-store-logic')
  .use('mesh',{pin:'store:*,kind:entry', bases:BASES})
