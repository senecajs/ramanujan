var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '127.0.0.1:39000,127.0.0.1:39001').split(',')

require('seneca')()//({log: 'silent'})
  .use('mesh',{
    bases: BASES,
    host: HOST,
    monitor: true,
    tag: null
  })
