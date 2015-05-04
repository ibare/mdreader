path    = require 'path'
gulp    = require 'gulp'
watch   = require 'gulp-watch'
sass    = require 'gulp-sass'
shell   = require 'gulp-shell'
rename  = require 'gulp-rename'

config =
  path:
    source:
      bower: 'bower_components',
      sass: 'sass'
    target:
      root: 'app',
      css: 'app/css',
      js: 'app/js',
      fonts: 'app/fonts'

utils =
  clearFileName: (name) ->
    match = /[\w\-]+((?=[\.\-]min)|(?=[\.\-]pack))/g.exec name
    return if match is null then name else match[0]

gulp.task 'compile-sass', ->
  gulp.src path.join(config.path.source.sass, '**/*.scss')
    .pipe sass style: 'compressed'
    .pipe gulp.dest path.join config.path.target.css

gulp.task 'deploy-library-files', ->
  gulp.src [
        path.join(config.path.source.bower, 'requirejs/require.js'),
        path.join(config.path.source.bower, 'jquery/dist/jquery.min.js'),
        path.join(config.path.source.bower, 'jquery/dist/jquery.min.map'),
        path.join(config.path.source.bower, 'underscore/underscore.js'),
        path.join(config.path.source.bower, 'backbone/backbone.js'),
        path.join(config.path.source.bower, 'bootstrap/dist/js/bootstrap.min.js'),
        path.join(config.path.source.bower, 'handlebars/handlebars.min.js'),
        path.join(config.path.source.bower, 'marked/marked.min.js'),
        path.join(config.path.source.bower, 'nprogress/nprogress.js'),
        path.join(config.path.source.bower, 'highlightjs/highlight.pack.js')
      ]
    .pipe rename (path) ->
      path.basename = utils.clearFileName path.basename
    .pipe gulp.dest config.path.target.js

  gulp.src [
        path.join(config.path.source.bower, 'bootstrap/dist/css/bootstrap.min.css'),
        path.join(config.path.source.bower, 'bootstrap/dist/css/bootstrap-theme.min.css'),
        path.join(config.path.source.bower, 'nprogress/nprogress.css'),
        path.join(config.path.source.bower, 'highlightjs/styles/sunburst.css')
      ]
    .pipe rename (path) ->
      path.basename = utils.clearFileName path.basename
    .pipe gulp.dest config.path.target.css

  gulp.src path.join config.path.source.bower, 'bootstrap/dist/fonts/*.*'
    .pipe gulp.dest config.path.target.fonts

gulp.task 'watch', ->
  gulp.watch path.join(config.path.source.sass, '**/*.scss'), -> gulp.start 'compile-sass'

gulp.task 'build', ->
  gulp.start [
    'compile-sass',
    'deploy-library-files'
  ]

gulp.task 'run', ->
  gulp.start shell.task ['electron ' + path.join config.path.target.root]

gulp.task 'default', ['build']
