// Unit test for the entry-cache microservice.
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
describe('entry-cache', function () {

  // A unit test (the test callback is named 'fin' to distinguish it from others).
  it('save-list', function (fin) {

    // Create a Seneca instance for testing.
    var seneca = test_seneca(fin)

    var data = {}
    var miss = {}

    seneca
    .add('store:save,kind:entry,cache:true', function (msg, reply) {
      var entry = this.make('entry', {
        when: msg.when,
        user: msg.user,
        text: msg.text
      })

      data[msg.user] = data[msg.user] || []
      data[msg.user].push(entry)
      reply(null, entry)
    })

    .add('store:list,kind:entry,cache:true', function (msg, reply) {
      miss[msg.user] = miss[msg.user] || 0
      miss[msg.user]++

      reply(null, data[msg.user])
    })


    // Gate the execution of actions for this instance. Gated actions are executed
    // in sequence and each action waits for the previous one to complete. Gating
    // is not required, but avoids excessive callbacks in the unit test code.
    seneca
      .gate()

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

        expect(data[entry.user].length).to.equal(1)
        expect(data[entry.user][0].text).to.equal('t0')
      })

      .act({
        store: 'list',
        kind: 'entry',
        user: 'u0'
      }, function (ignore, list) {
        expect(list.length).to.equal(1)
        expect(list[0].text).to.equal('t0')

        expect(miss['u0']).to.equal(1)
      })

      .act({
        store: 'list',
        kind: 'entry',
        user: 'u0'
      }, function (ignore, list) {
        expect(list.length).to.equal(1)
        expect(list[0].text).to.equal('t0')

        expect(miss['u0']).to.equal(1)
      })


    // Second save invalidates cache and miss count confirms this.
      .act({
        store: 'save',
        kind: 'entry',
        when: Date.now(),
        user: 'u0',
        text: 't1'

        // Because test mode is active, it is not necessary to handle
        // callback errors. These are passed directly to the 'fin' callback.
      }, function (ignore, entry) {
        expect(entry.user).to.equal('u0')
        expect(entry.text).to.equal('t1')

        expect(data[entry.user].length).to.equal(2)
        expect(data[entry.user][0].text).to.equal('t0')
        expect(data[entry.user][1].text).to.equal('t1')
      })

      .act({
        store: 'list',
        kind: 'entry',
        user: 'u0'
      }, function (ignore, list) {
        expect(list.length).to.equal(2)
        expect(list[0].text).to.equal('t0')
        expect(list[1].text).to.equal('t1')

        expect(miss['u0']).to.equal(2)
      })

      .act({
        store: 'list',
        kind: 'entry',
        user: 'u0'
      }, function (ignore, list) {
        expect(list.length).to.equal(2)
        expect(list[0].text).to.equal('t0')
        expect(list[1].text).to.equal('t1')

        expect(miss['u0']).to.equal(2)
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
    .use(require('../entry-cache-logic'))
}
