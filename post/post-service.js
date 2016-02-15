var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'post',
  //log:'all'
})
  .use('post-logic')
  .use('mesh',{
    pin: 'post:*',
    bases: BASES
  })
