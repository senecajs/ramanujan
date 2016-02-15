var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'entry-store',
  //log:'all'
})
  .use('entry-store-logic')
  .use('mesh',{
    pin: 'store:*,kind:entry', 
    bases: BASES
  })
