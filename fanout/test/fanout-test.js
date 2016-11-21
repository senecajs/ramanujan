// Unit test for the fanout microservice.
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
describe('fanout', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('entry', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Add dynamic mock messages, just for this test.
    seneca
      .add('follow:list,kind:followers', function (msg, reply) {
        reply(null, ['red', 'green', 'blue'])
      })

    // The final verification step of this test.
      .add('timeline:insert', function (msg, reply) {
        expect(msg.users).to.equal(['red', 'green', 'blue'])
        reply()
        fin()
      })

    // No need to gate this test, as just one message sent.
    seneca

      .act({
        fanout: 'entry',
        user: 'foo',
        text: 't0',
        when: Date.now()
      })
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when a error occurs anywhere.
    .test(fin)

  // Load the microservice business logic
    .use(require('../fanout-logic'))
}
