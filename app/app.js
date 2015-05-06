define([
  'handlebars',
  'highlight',
  'marked',
  'nprogress'
], function(Handlebars, Hljs, Marked, Nprogress) {
  var remote = require('remote');
  var ipc = require('ipc');
  var mdfs = remote.require('./mdfs');
  var current = null;
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
      mdfs.seek(directory, function(err, results) {
        Backbone.$('.markdown .nav.directory')[0].innerHTML = Handlebars.compile('{{#each directory}}<li><a href="#directory/{{path}}"><i class="fa fa-folder-o"></i>{{name}}</a></li>{{/each}}')({ directory: results.directory });
        Backbone.$('.markdown .nav.files')[0].innerHTML = Handlebars.compile('{{#each files}}<li><a href="#docs/{{name}}"><i class="fa fa-medium"></i>{{name}}</a><ul data-filename="{{name}}"></ul></li>{{/each}}')({ files: results.files });
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
      var previous, customRenderer = new Marked.Renderer();

      if(current != null) {
        Backbone.$('.markdown .nav a[href="#docs/'+current+'"]').removeClass('active');
        Backbone.$('.markdown .nav a[href="#docs/'+name+'"]').addClass('active');

        previous = Backbone.$('ul[data-filename="'+current+'"]');

        if(previous != undefined && previous.length > 0) previous[0].innerHTML = '';
      }

      current = name;

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
      };

      customRenderer.heading = function(text, level) {
        var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        if(level == 2) {
          Backbone.$('ul[data-filename="'+current+'"]').append('<li><i class="fa fa-toggle-off"></i>'+escapedText+'</li>');
        }

        return Handlebars.compile('<h{{level}}>{{text}}</h{{level}}>')({ level: level, text: escapedText });
      };

      mdfs.read(name, function(err, body) {
        Backbone.$('.markdown-body')[0].innerHTML = Marked(body, { renderer: customRenderer });

        window.scrollTo(0, 0);
      });
    }
  });
});
