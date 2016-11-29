// Unit test for the post microservice.
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
describe('post', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('entry', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Add dynamic mock messages, just for this test.
    seneca
      .add('store:save,kind:entry', function (msg, reply) {
        reply(null, this.make('entry', {
          when: msg.when,
          user: msg.user,
          text: msg.text
        }))
      })

    // The final verification step of this test.
      .add('info:entry', function (msg, reply) {
        expect(msg.user).to.equal('u0')
        expect(msg.text).to.equal('t0')
        reply()
        fin()
      })

    // No need to gate this test, as just one message sent.
    seneca

      .act({
        post: 'entry',
        user: 'u0',
        text: 't0',
        when: Date.now()
      })
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when an error occurs anywhere.
    .test(fin)

  // The test needs to construct entities
    .use('entity')

  // Load the microservice business logic
    .use(require('../post-logic'))
}
