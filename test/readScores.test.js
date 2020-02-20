const Mocha = require('mocha');
const assert = require('assert');
const fs = require('fs');

const readScores = require('../readScores');
const sampleInput = fs.readFileSync('sample-input.txt', 'utf8');
const expectedOutput = fs.readFileSync('expected-output.txt', 'utf8');

const mocha = new Mocha();

describe("readScores", function() {
  it("formats sample input to expected output", function() {
    const output = readScores(sampleInput);
    assert.equal(output, expectedOutput);
  });
});

mocha.run();
