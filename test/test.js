var assert = require('assert');
var path = require('path');
var upgradeHtml = require('../lib/upgrade_html');
var fs = require('fs');


var fixturesDir = path.join(path.dirname(__filename), 'fixtures');
var outputFilesAssertedOn = new Set();

suite('Upgrading HTML', function() {
  var files = fs.readdirSync(fixturesDir);
  files.forEach(function(filename) {
    if (!/\.html$/.test(filename)) {
      return; // We only want the html files.
    }
    test('upgrade ' + filename, function() {
      var fullPath = path.join(fixturesDir, filename);
      var filemapping = upgradeHtml(fullPath);
      for (var resultFilename in filemapping) {
        outputFilesAssertedOn.add(resultFilename + '.out');
        var expectedOutput = fs.readFileSync(resultFilename + '.out', 'utf-8');
        var actualOutput = filemapping[resultFilename];
        assert.equal(expectedOutput, actualOutput);
      }
    });
  });
  after(function() {
    var outputFiles = files.filter(
        function(filename) { return /\.out$/.test(filename); });
    var unassertedFiles = [];
    outputFiles.forEach(function(outfile) {
      outfile = path.resolve(fixturesDir, outfile);
      if (!outputFilesAssertedOn.has(outfile)) {
        unassertedFiles.push(path.basename(outfile));
      }
    });
    if (unassertedFiles.length > 0) {
      throw new Error(
            'No assertions made about the fixture output file ' +
            JSON.stringify(unassertedFiles));
    }
  });
});