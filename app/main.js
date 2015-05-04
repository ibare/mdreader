'use strict'
var app = require('app');
var BrowserWindow = require('browser-window');
var CrashReporter = require('crash-reporter');
var process = require('process');
var ipc = require('ipc');
var dialog = require('dialog');
var mainWindow = null;

CrashReporter.start()

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 700,
    frame: true
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('open', function(event, args) {
  var dialog = require('dialog');
  var files = dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, function(filenames) {
    if(filenames != undefined) event.sender.send('open-dir', filenames[0]);
  });
});
