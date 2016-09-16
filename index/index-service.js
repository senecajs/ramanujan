var BASES = (process.env.BASES || process.argv[2] || '').split(',')
var MESH = process.env.MESH ? process.env.MESH === 'true' : true

require('seneca')({
  tag: 'index',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})

  .use('index-logic')

  .use('../transport-config/transport-config',{
    mesh: MESH,
    listen:[
      {pin: 'search:*'},
      {pin: 'info:entry', model:'observe'}
    ],
    bases: BASES
  })

  .ready(function(){
    this.add('info:entry', function(msg,done){
      delete msg.info
      this.act('search:insert',msg,done)
    })

    console.log(this.id)
  })
