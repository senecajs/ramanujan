// Unit test for the reserve microservice.
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
describe('reserve', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('create-remove', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

    // Send an action, and validate the response.
      .act({
        reserve: 'create',
        key: 'k0'
      }, function (ignore, status) {
        expect(status.ok).to.equal(true)
      })

      .act({
        reserve: 'create',
        key: 'k1'
      }, function (ignore, status) {
        expect(status.ok).to.equal(true)
      })


      .act({
        reserve: 'create',
        key: 'k0'
      }, function (ignore, status) {
        expect(status.ok).to.equal(false)
      })

      .act({
        reserve: 'create',
        key: 'k1'
      }, function (ignore, status) {
        expect(status.ok).to.equal(false)
      })


      .act({
        reserve: 'remove',
        key: 'k1'
      })


      .act({
        reserve: 'create',
        key: 'k0'
      }, function (ignore, status) {
        expect(status.ok).to.equal(false)
      })

      .act({
        reserve: 'create',
        key: 'k1'
      }, function (ignore, status) {
        expect(status.ok).to.equal(true)
      })


      .act({
        reserve: 'remove',
        key: 'k0'
      })

      .act({
        reserve: 'remove',
        key: 'k1'
      })


      .act({
        reserve: 'create',
        key: 'k0'
      }, function (ignore, status) {
        expect(status.ok).to.equal(true)
      })

      .act({
        reserve: 'create',
        key: 'k1'
      }, function (ignore, status) {
        expect(status.ok).to.equal(true)
      })

    setTimeout(function() {
      seneca

        .act({
          reserve: 'read',
          key: 'k0'
        }, function (ignore, status) {
          expect(status.ok).to.equal(false)
        })

        .act({
          reserve: 'read',
          key: 'k1'
        }, function (ignore, status) {
          expect(status.ok).to.equal(false)
        })

      fin()
    }, 222)
  })
})


// Construct a Seneca instance suitable for unit testing
function test_seneca (fin) {
  return Seneca({log: 'test'})

  // activate unit test mode. Errors provide additional stack tracing context.
  // The fin callback is called when a error occurs anywhere.
    .test(fin)

  // Load the microservice business logic
    .use(require('../reserve-logic'), {interval: 11, expires: 111})
}
