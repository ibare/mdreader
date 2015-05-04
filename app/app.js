define([
  'handlebars',
  'highlight',
  'marked',
  'nprogress'
], function(Handlebars, Hljs, Marked, Nprogress) {
  return Backbone.Router.extend({
    routes: {
    },

    initialize: function() {
      console.log('okay');

      Backbone.history.start();
    }
  });
});
