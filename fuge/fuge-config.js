var BASES = (process.env.BASES || '127.0.0.1:39000,127.0.0.1:39001')
var OPTS = (process.env.OPTS || '--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1')

module.exports = {
  runDocker: false,
  tail: true,
  restartOnError: true,
  overrides: {
    base0: { 
      run: 'node base.js base0 39000 '+BASES+' '+OPTS
    },
    base1: { 
      run: 'node base.js base1 39001 '+BASES+' '+OPTS
    },
    api: { 
      run: 'node api-service.js 0 '+BASES+' '+OPTS,
    },
    post: {
      run: 'node post-service.js '+BASES+' '+OPTS,
    },
    entry_store: {
      run: 'node entry-store-service.js '+BASES+' '+OPTS,
    },
    entry_cache: {
      run: 'node entry-cache-service.js '+BASES+' '+OPTS,
    },
    repl: {
      run: 'node repl-service.js 10001 '+BASES+' '+OPTS,
    },
    mine: {
      run: 'node mine-service.js 0 '+BASES+' '+OPTS,
    },
    home: {
      run: 'node home-service.js 0 '+BASES+' '+OPTS,
    },
    search: {
      run: 'node search-service.js 0 '+BASES+' '+OPTS,
    },
    index: {
      run: 'node index-service.js '+BASES+' '+OPTS,
    },
    follow: {
      run: 'node follow-service.js '+BASES+' '+OPTS,
    },
    fanout: {
      run: 'node fanout-service.js '+BASES+' '+OPTS,
    },
    timeline0: {
      run: 'node timeline-service.js 0 '+BASES+' '+OPTS,
    },
    timeline1: {
      run: 'node timeline-service.js 1 '+BASES+' '+OPTS,
    },
    timeline_shard: {
      run: 'node timeline-shard-service.js '+BASES+' '+OPTS,
    },
    front: { 
      run: 'node front.js '+BASES+' '+OPTS,
    }
  }
};

