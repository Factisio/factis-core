/**
 * Query Engine tests
 * @author Vincent Lecrubier <vincent.lecrubier@gmail.com>
 * @since  2015-04-19
 */

jest
  .dontMock('../engine.js')
  .dontMock('../api.js')
  .dontMock('../index.js');

var core = require('../index.js');

describe('Core', function() {

  describe('Query API', function() {
    it('fact(a,b,c)', function() {
      expect(core.fact("a", "b", "c")).toEqual({
        x: "fact",
        a: ["a", "b", "c", true]
      });
    });
    it('fact(a,b,c,false)', function() {
      expect(core.fact("a", "b", "c", false)).toEqual({
        x: "fact",
        a: ["a", "b", "c", false]
      });
    });
    it('the(thing)', function() {
      expect(core.the("stuff")).toEqual({
        x: "var",
        a: ["stuff"]
      });
    });
    it('and()', function() {
      expect(core.and()).toEqual({
        x: "and",
        a: []
      });
    });
    it('and(a)', function() {
      expect(core.and("a")).toEqual({
        x: "and",
        a: ["a"]
      });
    });
    it('and(a,b)', function() {
      expect(core.and("a", "b")).toEqual({
        x: "and",
        a: ["a", "b"]
      });
    });
    it('or()', function() {
      expect(core.or()).toEqual({
        x: "or",
        a: []
      });
    });
    it('or(a)', function() {
      expect(core.or("a")).toEqual({
        x: "or",
        a: ["a"]
      });
    });
    it('or(a,b)', function() {
      expect(core.or("a", "b")).toEqual({
        x: "or",
        a: ["a", "b"]
      });
    });
    it('not(a)', function() {
      expect(core.not("a")).toEqual({
        x: "not",
        a: ["a"]
      });
    });
    it('implies(a,b)', function() {
      expect(core.implies("a", "b")).toEqual({
        x: "or",
        a: [{
          x: "not",
          a: ["a"]
        }, "b"]
      });
    });
    it('equivalent(a,b)', function() {
      expect(core.equivalent("a", "b")).toEqual({
        x: "and",
        a: [{
          x: "or",
          a: [{
            x: "not",
            a: ["a"]
          }, "b"]
        }, {
          x: "or",
          a: [{
            x: "not",
            a: ["b"]
          }, "a"]
        }]
      });
    });
  });


  describe('Query Engine', function() {

    it('xpo one', function() {
      expect(core.query(
        core.fact(core.the("x"), "b", "c"), {
          queryXPO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "x": "a"
      }]);
    });

    it('xpo infinity', function() {
      expect(core.query(
        core.fact(core.the("x"), "b", "c"), {
          queryXPO: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('fact(the(x),the(b),the(c))', function() {
      expect(core.query(
        core.fact(core.the("x"), core.the("y"), core.the("z")), {
          queryXXX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "x": "a",
        "y": "b",
        "z": "c"
      }]);
    });

  });

});
