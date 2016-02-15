var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'entry-cache',
  log:'all'
})
  .use('entry-cache-logic')
  .use('mesh',{ 
    pin: 'store:list,kind:entry,cache:*',
    bases: BASES
  })
