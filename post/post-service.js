var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({tag:'post',debug:{undead:true}})
  .use('post-logic')
  .use('mesh',{pins:['post:*','role:api'],bases:BASES,sneeze:{silent:true}})
