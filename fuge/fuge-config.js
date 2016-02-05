var BASES = (process.env.BASES || '127.0.0.1:39000,127.0.0.1:39001').split(',')

module.exports = {
  runDocker: false,
  tail: true,
  restartOnError: true,
  overrides: {
    base0: { 
      run: 'node base.js base0 39000 '+BASES
    },
    base1: { 
      run: 'node base.js base1 39001 '+BASES
    },
    front: { 
      run: 'node front.js '+BASES
    },
    api: { 
      run: 'node api-service.js 0 '+BASES
    },
    post: {
      run: 'node post-service.js '+BASES
    },
    search: {
      run: 'node search-service.js '+BASES
    },
    entry_store: {
      run: 'node entry-store-service.js '+BASES
    },
    repl: {
      run: 'node repl-service.js '+BASES
    },
    mine: {
      run: 'node mine-service.js 0 '+BASES
    }
  }
};

