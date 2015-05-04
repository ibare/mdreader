'use strict'
var app = require('app');
var BrowserWindow = require('browser-window');
var CrashReporter = require('crash-reporter');
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
    width: 800,
    height: 700,
    frame: true
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
