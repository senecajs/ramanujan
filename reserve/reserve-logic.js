var _ = require('lodash')

module.exports = function follow (options) {
  var seneca = this

  var interval = options.interval || 22
  var expires  = options.expires || 1111


  seneca.add('reserve:create', reserve_create)
  seneca.add('reserve:read', reserve_read)
  seneca.add('reserve:remove', reserve_remove)


  var reservations = {}
  
  
  setInterval(function () {
    var now = Date.now()
    Object.keys(reservations).forEach(function (key) {
      var when = reservations[key]

      if (expires < now - when) {
        delete reservations[key]
      }
    })
  }, interval)


  function reserve_create(msg, reply) {
    var key = msg.key
    
    if (reservations[key]) {
      return reply(null, {ok:false})
    }

    reservations[key] = Date.now()
    return reply(null, {ok:true})
  }


  function reserve_read(msg, reply) {
    return reply(null, {ok: !!reservations[msg.key]})
  }


  function reserve_remove(msg, reply) {
    var found = !!reservations[msg.key]
    delete reservations[msg.key]
    return reply(null, {ok:found})
  }
}
 
