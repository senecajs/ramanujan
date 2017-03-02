var HOST = (process.env.HOST || '127.0.0.1')
var BASES = (process.env.BASES || '127.0.0.1:39000,127.0.0.1:39001')
var OPTS = (process.env.OPTS || '')

module.exports = {
  runDocker: false,
  tail: true,
  restartOnError: true,
  overrides: {
    base0: { 
      run: 'node base.js base0 39000 '+HOST+' '+BASES+' '+OPTS
    },
    base1: { 
      run: 'node base.js base1 39001 '+HOST+' '+BASES+' '+OPTS
    },
    api: { 
      run: 'node api-service.js 0 '+HOST+' '+BASES+' '+OPTS,
    },
    post: {
      run: 'node post-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    entry_store: {
      run: 'node entry-store-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    entry_cache: {
      run: 'node entry-cache-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    repl: {
      run: 'node repl-service.js 10001 '+HOST+' '+BASES+' '+OPTS,
    },
    mine: {
      run: 'node mine-service.js 0 '+HOST+' '+BASES+' '+OPTS,
    },
    home: {
      run: 'node home-service.js 0 '+HOST+' '+BASES+' '+OPTS,
    },
    search: {
      run: 'node search-service.js 0 '+HOST+' '+BASES+' '+OPTS,
    },
    index: {
      run: 'node index-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    follow: {
      run: 'node follow-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    fanout: {
      run: 'node fanout-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    timeline0: {
      run: 'node timeline-service.js 0 '+HOST+' '+BASES+' '+OPTS,
    },
    timeline1: {
      run: 'node timeline-service.js 1 '+HOST+' '+BASES+' '+OPTS,
    },
    timeline_shard: {
      run: 'node timeline-shard-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    reserve: { 
      run: 'node reserve-service.js '+HOST+' '+BASES+' '+OPTS,
    },
    front: { 
      run: 'node front.js '+HOST+' '+BASES+' '+OPTS,
    }
  }
};

