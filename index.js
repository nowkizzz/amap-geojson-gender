if (process.env.NODE_ENV === 'development') {
  const { Generator } = require('./src/index.ts');
  new Generator({});
} else {
  const { Generator } = require('./lib/index.js');
  new Generator({});
}
