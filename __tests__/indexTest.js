/**
 * Query Engine tests
 * @author Vincent Lecrubier <vincent.lecrubier@gmail.com>
 * @since  2015-04-19
 */

jest
// .dontMock('../engine.js')
// .dontMock('../api.js')
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

    it('xxx one', function() {
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

    it('xxx infinity', function() {
      expect(core.query(
        core.fact(core.the("x"), core.the("y"), core.the("z")), {
          queryXXX: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('xxo one', function() {
      expect(core.query(
        core.fact(core.the("x"), core.the("y"), "c"), {
          queryXXO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "x": "a",
        "y": "b"
      }]);
    });

    it('xxo infinity', function() {
      expect(core.query(
        core.fact(core.the("x"), core.the("y"), "c"), {
          queryXXO: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('xpx one', function() {
      expect(core.query(
        core.fact(core.the("x"), "b", core.the("z")), {
          queryXPX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "x": "a",
        "z": "c"
      }]);
    });

    it('xpx infinity', function() {
      expect(core.query(
        core.fact(core.the("x"), "b", core.the("z")), {
          queryXPX: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

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

    it('sxx one', function() {
      expect(core.query(
        core.fact("a", core.the("y"), core.the("z")), {
          querySXX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "y": "b",
        "z": "c"
      }]);
    });

    it('sxx infinity', function() {
      expect(core.query(
        core.fact("a", core.the("y"), core.the("z")), {
          querySXX: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('sxo one', function() {
      expect(core.query(
        core.fact("a", core.the("y"), "c"), {
          querySXO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "y": "b"
      }]);
    });

    it('sxo infinity', function() {
      expect(core.query(
        core.fact("a", core.the("y"), "c"), {
          querySXO: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('spx one', function() {
      expect(core.query(
        core.fact("a", "b", core.the("z")), {
          querySPX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "z": "c"
      }]);
    });

    it('spx infinity', function() {
      expect(core.query(
        core.fact("a", "b", core.the("z")), {
          querySPX: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

    it('spo one', function() {
      expect(core.query(
        core.fact("a", "b", "c"), {
          querySPO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{}]);
    });

    it('xpo infinity', function() {
      expect(core.query(
        core.fact("a", "b", "c"), {
          querySPO: function(e) {
            return null;
          }
        }
      )).toBeNull();
    });

  });

  describe('Complex queries', function() {

    it('fact', function() {
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

    it('and', function() {
      expect(core.query(
        core.and(
          core.fact(core.the("x"), "b", "c"),
          core.fact("a", core.the("y"), core.the("z"))
        ), {
          queryXXX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          queryXXO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          queryXPX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          queryXPO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          querySXX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          querySXO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          querySPX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          querySPO: function(e) {
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


    it('or', function() {
      expect(core.query(
        core.or(
          core.fact(core.the("x"), "b", "c"),
          core.fact("a", core.the("y"), core.the("z"))
        ), {
          queryXPO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          },
          querySXX: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([{
        "x": "a"
      }, {
        "y": "b",
        "z": "c"
      }]);
    });


    it('not', function() {
      expect(core.query(
        core.not(
          core.fact(core.the("x"), "b", "c")
        ), {
          queryXPO: function(e) {
            return [

            ];
          }
        }
      )).toEqual([{}]);
    });

    it('not', function() {
      expect(core.query(
        core.not(
          core.fact(core.the("x"), "b", "c")
        ), {
          queryXPO: function(e) {
            return [

            ];
          }
        }
      )).toEqual([{}]);

      expect(core.query(
        core.not(
          core.fact(core.the("x"), "b", "c")
        ), {
          queryXPO: function(e) {
            return [
              ["a", "b", "c"]
            ];
          }
        }
      )).toEqual([]);
    });


  });

});
