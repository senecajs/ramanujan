var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({
  tag: 'index',
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})

  .use('index-logic')

  .add('info:entry', function(msg,done){
    delete msg.info
    this.act('search:insert',msg,done)
  })

  .use('mesh',{
    listen:[
      {pin: 'search:*'},
      {pin: 'info:entry', model:'observe'}
    ],
    bases: BASES
  })

  .ready(function(){
    console.log(this.id)
  })
