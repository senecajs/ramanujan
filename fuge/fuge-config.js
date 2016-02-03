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
    api0: { 
      run: 'node api.js 9000 '+BASES
    },
    api1: { 
      run: 'node api.js 9001 '+BASES
    },
    post: {
      run: 'node post-service.js '+BASES
    },
    search: {
      run: 'node search-service.js '+BASES
    }
  }
};

