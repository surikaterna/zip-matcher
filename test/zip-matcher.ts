import match from "../src";
import parser from "zip-parser";
var should = require('should');

describe('zipMatcher', function describeZipParser() {
    it('should match single value zip', function() {
        should(match('41114', parser('41114'))).equal(true);
      });
      it('should match multi value zip', function() {
        should(match('41114', parser('12345, 41114'))).equal(true);
      });
      it('should match range zip', function() {
        should(match('41114', parser('12345-41116'))).equal(true);
      });
      it('should match ? wildcard', function() {
        should(match('41114', parser('411??'))).equal(true);
      });
      it('should match * wildcard', function() {
        should(match('41114', parser('4*14'))).equal(true);
      });
      it('should not match * wildcard', function() {
        should(match('41114', parser('1*14'))).equal(false);
      });    
      it('should match regexp', function() {
        should(match('41114', parser('/4.*14/'))).equal(true);
      });
});