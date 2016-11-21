// Unit test for entry-store microservice.
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
describe('entry-store', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('add-entry', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

    // Send an action, and validate the response.
      .act({
        store: 'save',
        kind: 'entry',
        when: Date.now(),
        user: 'u0',
        text: 't0'

        // Because test mode is active, it is not necessary to handle
        // callback errors. These are passed directly to the 'fin' callback.
      }, function (ignore, entry) {
        expect(entry.user).to.equal('u0')
        expect(entry.text).to.equal('t0')
      })

      .act({
        store: 'save',
        kind: 'entry',
        when: Date.now(),
        user: 'u0',
        text: 't1'
      }, function (ignore, entry) {
        expect(entry.user).to.equal('u0')
        expect(entry.text).to.equal('t1')
      })

      .act({
        store: 'list',
        kind: 'entry',
        user: 'u0'
      }, function (ignore, list) {
        expect(list.length).to.equal(2)
        expect(list[0].text).to.equal('t1')
        expect(list[1].text).to.equal('t0')
      })

    // Once all the tests are complete, invoke the test callback
      .ready(fin)
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when a error occurs anywhere.
    .test(fin)

  // Load the plugin dependencies of the microservice
    .use('basic')
    .use('entity')

  // Load the microservice business logic
    .use('../entry-store-logic')
  
  // IMPORTANT! Provide mocks for any message patterns that the microservice
  // depends on. In production these are provided by other microservices.
  // To define a mock message, just add an action for the message pattern.
    .add('timeline:insert', function (msg, reply) {
      reply()
    })
}
