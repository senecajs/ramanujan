// Unit test for the timeline microservice.
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
describe('timeline', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('insert-list', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

    // Send an action; there's no response expected for this message.
    // User aaa has posted entry t0 which is inserted into the timelines of
    // users bbb and ccc.
      .act({
        timeline: 'insert',
        user: 'aaa',
        users: ['bbb', 'ccc'],
        text: 't0',
        when: Date.now()
      })

      .act({
        timeline: 'insert',
        user: 'bbb',
        users: ['aaa', 'ccc'],
        text: 't1',
        when: Date.now()
      })

    // aaa has the t1 entry by bbb
      .act({timeline: 'list', user: 'aaa'},
           function (ignore, list) {
             expect(list.length).to.equal(1)
             expect(list[0].text).to.equal('t1')
           })

    // bbb has the to entry by aaa
      .act({timeline: 'list', user: 'bbb'},
           function (ignore, list) {
             expect(list.length).to.equal(1)
             expect(list[0].text).to.equal('t0')
           })
    
    // ccc has nothing
      .act({timeline: 'list', user: 'ccc'},
           function (ignore, list) {
             expect(list.length).to.equal(0)
           })
    
    // Once all the tests are complete, invoke the test callback
      .ready(fin)
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
    .use('basic')
    .use('entity')

  // Load the microservice business logic
    .use(require('../timeline-logic'))
  
  // IMPORTANT! Provide mocks for any message patterns that the microservice
  // depends on. In production these are provided by other microservices.
  // To define a mock message, just add an action for the message pattern.

    .add('follow:list,kind:following', function (msg, reply) {
      reply(null, ['bbb'])
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
