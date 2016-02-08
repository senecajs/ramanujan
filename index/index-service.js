var BASES = (process.env.BASES || process.argv[2] || '').split(',')

require('seneca')({tag:'index',debug:{undead:true}})
  .use('index-logic')

  .add('info:entry',function(msg,done){
    delete msg.info
    this.act('search:insert',msg,done)
  })

  .use('mesh',{
    listen: [
      { pin:'search:*' },
      { pin:'info:entry', model:'publish' },
    ], bases:BASES})
