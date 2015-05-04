define([
  'handlebars',
  'highlight',
  'marked',
  'nprogress'
], function(Handlebars, Hljs, Marked, Nprogress) {
  var remote = require('remote');
  var ipc = require('ipc');
  var mdfs = remote.require('./mdfs');
  var _this = null;

  return Backbone.Router.extend({
    routes: {
      'open': 'open',
      'docs/:name': 'read',
      'directory/*path': 'openDir',
      'external/*path': 'externalLink'
    },

    initialize: function() {
      _this = this;

      this.load();
      ipc.on('open-dir', this.openDir);

      Marked.setOptions({
        highlight: function (code) {
          return Hljs.highlightAuto(code).value;
        }
      });

      Backbone.history.start();
    },

    load: function(directory) {
      var match, customRenderer = new Marked.Renderer();

      customRenderer.link = function(href, title, text) {
        var protocol = /.+(?=:\/)/.exec(href);

        if(protocol == null) {
          match = /[\w+\-]+(?=\.md)/g.exec(href);
          return match == null ?
            Handlebars.compile('<span>{{text}}</span>')({ text: text }) :
            Handlebars.compile('<a href="#docs/{{link}}">{{text}}</a>')({ link: match[0], text: text });
        } else {
          return Handlebars.compile('<a href="#external/{{link}}">{{text}}</a>')({ link: href, text: text });
        }
      }

      mdfs.seek(directory, function(err, results) {
        Backbone.$('.markdown.directory')[0].innerHTML = Handlebars.compile('{{#each directory}}<li><a href="#directory/{{path}}">{{name}}</a></li>{{/each}}')({ directory: results.directory });
        Backbone.$('.markdown.files')[0].innerHTML = Handlebars.compile('{{#each files}}<li><a href="#docs/{{name}}">{{name}}</a></li>{{/each}}')({ files: results.files });
      });
    },

    open: function() {
      ipc.send('open');
    },

    openDir: function(directory) {
      _this.load(directory);
    },

    externalLink: function(link) {
      window.open(link);
    },

    read: function(name) {
      mdfs.read(name, function(err, body) {
        Backbone.$('.markdown-body')[0].innerHTML = Marked(body);
        window.scrollTo(0, 0);
      });
    }
  });
});
