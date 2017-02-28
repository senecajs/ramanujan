// Business logic for the index microservice.
// Provides a full text search index for microblog entries.


// Modules providing a simple in-memory full text search index.
// In production you could replace these with API calls to elasticsearch
// or similar.
var Levelup = require('levelup')
var Memdown = require('memdown')
var Search  = require('search-index')


// This is the standard way to define a Seneca plugin.
module.exports = function index (options) {

  // The plugin Seneca instance is provided by `this`.
  // This Seneca instance tracks patterns against this plugin
  // as an aid to debugging.
  var seneca = this


  // The search index. This is the internal state of the service. In general.
  // services should *not* have internal state, as it has to be synchronized
  // between multiple instances. This service is purely for demonstration purposes,
  // and only a single instance should be run.
  var index


  // The Seneca patterns that this plugin defines.
  // This is the `interface` for this plugin - matching messages will end up here.
  seneca.add('search:query', search_query)
  seneca.add('search:insert', search_insert)
  seneca.add('init:index', init)


  // Query the search index.
  // The implementation logic consists of calls to the search index API.
  function search_query (msg, done) {
    console.log(terms)

    var terms = msg.query.split(/ +/)

    var query = {
      query: {
        AND: {text:terms}
      }
    }

    index.search(query, function (err, out) {
      var hits = (out && out.hits) || []

      hits = hits.map(function (hit) {
        return hit.document
      })

      done(null, hits)
    })
  }


  // Insert a document into the search index.
  function search_insert (msg, done) {
    index.add([{
      id: msg.id,
      text: msg.text,
      user: msg.user,
      when: msg.when
    }], {}, done)
  }


  // Initialize the plugin. This is the standard mechanism to initialize a Seneca
  // plugin - by defining a special pattern of the form init:<plugin-name>.
  function init (msg, done) {
    Search({
      indexes: Levelup('si', {
        db: Memdown, 
        valueEncoding: 'json'
      })
    }, function(err, si) {
      if (err) return done(err)
      index = si
      done()
    })
  }
}
