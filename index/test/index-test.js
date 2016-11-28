// Unit test for the index microservice.
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
describe('index', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('insert-query', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

    // Send an action, and validate the response.
      .act({
        search: 'insert',
        id: ''+Math.random(),
        when: Date.now(),
        user: 'u0',
        text: 'lorem ipsum dolor sit amet'
      }, function (ignore) {})

      .act({
        search: 'query',
        query: 'ipsum',

        // Because test mode is active, it is not necessary to handle
        // callback errors. These are passed directly to the 'fin' callback.
      }, function (ignore, list) {
        expect(list.length).to.equal(1)
        expect(list[0].text).to.equal('lorem ipsum dolor sit amet')
      })

    // Once all the tests are complete, invoke the test callback
      .ready(fin)
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when an error occurs anywhere.
    .test(fin)

  // Load the microservice business logic.
    .use(require('../index-logic'))
}
