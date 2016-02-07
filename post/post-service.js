var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({tag:'post',debug:{undead:true}})
  .use('post-logic')
  .use('mesh',{pin:'post:*',bases:BASES,sneeze:{silent:true}})
