
var NETWORK_CONFIGURATION = {
  'entry-cache': {
    port: 3101,
    pin: 'store:list,kind:entry,cache:*'
  },
  'entry-store': {
    port: 3102,
    pin: 'store:*,kind:entry'
  },
  fanout: {
    port: 3103,
    listen:[
      {pin: 'fanout:*'},
      {pin: 'info:entry', model:'observe'}
    ]
  },
  follow: {
    port: 3104,
    pin: 'follow:*'
  },
  index: {
    port: 3105,
    listen: [
      {pin: 'search:*'},
      {pin: 'info:entry', model:'observe'}
    ]
  },
  post: {
    port: 3106,
    pin: 'post:*'
  },
  'timeline-shard': {
    port: 3107,
    pin: 'timeline:*'
  },
  timeline0: {
    port: 3108,
    pin: 'timeline:*,shard:0'
  },
  timeline1: {
    port: 3109,
    pin: 'timeline:*,shard:1'
  }
}

function client(seneca, service_name, config, pins_to_override) {
  var opts = {
    port: config.port
  }

  if (config.pin) {
    opts.pin = config.pin
    seneca.client(opts)
    return
  }

  if (!config.listen) {
    return
  }

  opts.pins = []

  config.listen.forEach(function (i) {
    if (i.model === 'observe') {
      opts.pins.push(i.pin + ',for:' + service_name)
      pins_to_override[i.pin] = pins_to_override[i.pin] || []
      pins_to_override[i.pin].push(service_name)
    }
    else {
      opts.pins.push(i.pin)
    }
  })

  seneca.client(opts)
}

function pickPin(value) {
  return value.pin
}

function listen (seneca, config) {
  var opts = {
    port: config.port,
  }

  if (config.pin) {
    opts.pin = config.pin
  }

  if (config.listen) {
    opts.pins = config.listen.map(pickPin)
  }

  seneca.listen(opts)
}

function override_pins (seneca, override_map) {
  Object.keys(override_map).forEach(function (pin) {
    seneca.add(pin, {strict$: {add: true}}, function (msg, done) {
      for (var i = 0; i < override_map[pin].length; i++) {
        routed_msg = Object.create(msg)
        routed_msg.for = override_map[pin][i];
        this.act(pin + ',for:' + override_map[pin][i], msg)
      }
      done()
    })
  })
}

function transport_config_plugin (opts) {
  var seneca = this.root;
  var current_service = seneca.private$.optioner.get().tag

  if (opts.mesh) {
    seneca.log.debug('transport_config using mesh')
    delete opts.mesh
    seneca.use('mesh', opts)
    return
  }

  seneca.log.debug('transport_config using http transport')
  seneca.use('zipkin-tracer')

  var service
  var config
  var pins_to_override = {}

  for (service in NETWORK_CONFIGURATION) {
    config = NETWORK_CONFIGURATION[service]
    if (service === current_service) {
      listen(seneca, config)
      continue
    }

    client(seneca, service, config, pins_to_override)
  }

  override_pins(this, pins_to_override)
}

module.exports = transport_config_plugin
