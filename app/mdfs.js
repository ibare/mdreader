var fs = require('fs');
var path = require('path');
var process = require('process');
var workingDirectory = null;

var mdfs = {
  seek: function(directory, cb) {
    var walk = function(dir, done) {
      var results = {
        files: [],
        directory: []
      };

      results.directory.push({
        path: path.resolve(dir, '..'),
        name: '..'
      });

      fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file) {
          fs.stat(path.resolve(dir, file), function(err, stat) {
            if(stat.isDirectory()) {
              results.directory.push({
                path: path.resolve(dir, file),
                name: file
              });
            } else {
              if(/\.md/g.test(file)) {
                results.files.push({
                  path: dir,
                  name: file
                });
              }
            }

            if (!--pending) done(null, results);
          });
        });
      });
    };

    workingDirectory = directory || process.cwd();
    walk(workingDirectory, cb);
  },

  read: function(file, cb) {
    fs.readFile(path.resolve(workingDirectory, file), 'utf-8', function(err, data) {
      cb(err, data);
    });
  }
}

module = module.exports = mdfs;
