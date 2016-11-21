// Unit test for the follow microservice.
// Uses https://github.com/hapijs/lab but easy to refactor for other unit testers.

// The utility function test_seneca constructs an instance of Seneca
// suitable for test execution, using the seneca.test() method.

var Lab = require('lab')
var Code = require('code')
var Seneca = require('seneca')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect

// A suite of unit tests for this microservice.
describe('follow', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('add-followers', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

    // Send an action; there's no response expected for this message
      .act({
        follow: 'user',
        user: 'f0',
        target: 'u0'
      })

    // Send an action; there's no response expected for this message
      .act({
        follow: 'user',
        user: 'f1',
        target: 'u0'
      })

    // follower lists are eventually consistent
    setTimeout(function () {
      seneca
        .act({
          follow: 'list',
          user: 'u0',
          kind: 'followers'
        }, function (ignore, list) {
          expect(list.length).to.equal(2)
          expect(list).to.equal(['f0', 'f1'])
        })

        // Once all the tests are complete, invoke the test callback
        .ready(fin)
    }, 222)
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  // In production, reservations will expire
  var reservations = {}

  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when a error occurs anywhere.
    .test(fin)

  // Load the plugin dependencies of the microservice
    .use('entity')

  // Load the microservice business logic
    .use(require('../follow-logic'))
  
  // IMPORTANT! Provide mocks for any message patterns that the microservice
  // depends on. In production these are provided by other microservices.
  // To define a mock message, just add an action for the message pattern.

    .add('timeline:insert', function (msg, reply) {
      reply()
    })

    .add('store:list,kind:entry', function (msg, reply) {
      reply(null, [])
    })

    .add('reserve:create', function (msg, reply) {
      if (reservations[msg.key]) {
        return reply(null, {ok: false})
      }
      else {
        reservations[msg.key] = true
        return reply(null, {ok: true})
      }
    })

    .add('reserve:remove', function (msg, reply) {
      reservations[msg.key] = false
    })
}
