exports.config = {

  specs: ['e2e/**/*.js'],

  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2
  },

  chromeDriver: '../node_modules/protractor/selenium/chromedriver',

  baseUrl: 'http://localhost:3000/',

  framework: 'jasmine',

};