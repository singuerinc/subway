module.exports = {
  'extends': 'airbnb-base',
  'rules': {
    'no-underscore-dangle': ['error', { 'allowAfterThis': true }],
    'newline-after-var': ['error', 'always']
  },
  'env': {
    'browser': true
  },
  'globals': {
    'PIXI': true,
    'Stats': true
  }
};
