requirejs.config({
  baseUrl: './',

  paths: {
    'jquery': 'js/jquery',
    'underscore': 'js/underscore',
    'backbone': 'js/backbone',
    'bootstrap': 'js/bootstrap',
    'handlebars': 'js/handlebars',
    'marked': 'js/marked',
    'highlight': 'js/highlight',
    'nprogress': 'js/nprogress',
    'app': 'app'
  },

  shim: {
    'bootstrap': ['jquery'],
    'highlight': {
      exports: 'hljs'
    },
    'app': {
      deps: ['jquery', 'backbone']
    }
  }
});

define(['app'], function(App) {
  window.App = new App();
});
