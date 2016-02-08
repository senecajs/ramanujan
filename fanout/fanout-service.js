var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({tag:'fanout',debug:{undead:true}})
  .use('fanout-logic')
  .use('mesh',{pin:'info:entry',model:'publish',bases:BASES,sneeze:{silent:true}})

/*
  .add('follow:list', function(msg,done){
    done(null,['bar','car','dar','ear'])
  })

  .add('timeline:insert',function(msg,done){
    console.log('INSERT',msg)
    done()
  })

  .act('info:entry,user:foo,text:f0,when:1234')
*/

