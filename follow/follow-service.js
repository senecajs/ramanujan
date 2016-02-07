var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag:'follow',
  debug:{undead:true}
})
  .use('follow-logic')
  .use('mesh',{pin:'follow:*',bases:BASES,sneeze:{silent:true}})

/*
  .ready(function(){
    var seneca = this

    seneca.act('follow:user,user:f0,target:u0')
    seneca.act('follow:user,user:f1,target:u0')
    
    setTimeout( function() {
      seneca.act('follow:list,kind:followers,user:u0', function(e,list){
        console.log('u0',list)
      })
    },111)
  })
*/
