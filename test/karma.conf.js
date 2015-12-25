module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'client/scripts/vendor/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/scripts/**/*.js',
      'client/views/**/*.html',
      'client/components/**/*.js',
      'client/components/**/*.html',
      'test/unit/client/**/*.js'
    ],

    preprocessors: {
      'client/views/**/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'htmlTemplates'
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

  });
};
