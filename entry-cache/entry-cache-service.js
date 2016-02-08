var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({tag:'entry-cache',debug:{undead:true}})
  .use('entry-cache-logic')
  .use('mesh',{
    listen: [
      { pin:'store:list,kind:entry,cache:true' },
      { pin:'info:entry', model:'publish' }
    ],
    bases:BASES,sneeze:{silent:true}})
