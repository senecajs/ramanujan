var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag: 'follow',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .use('entity')
  .use('follow-logic')
  .use('../transport-config/transport-config',{
    mesh: MESH,
    pin: 'follow:*',
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })


/* In Situ Testing
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
