/**
 * Implementation of the JS DSL for queries, very simple !
 * x means "operator"
 * a means "argument"
 * s means "subject"
 * p means "predicate"
 * o means "object"
 * v means "value"
 * @author Vincent Lecrubier <vincent.lecrubier@gmail.com>
 * @since  2015-04-19
 */



/**
 * Describe a fact, pretty much a triple, but with the possibility of variables.
 * @param  {element} s Subject
 * @param  {element} p Predicate
 * @param  {element} o Object
 * @param  {any} v description
 * @return {term} term
 */
var fact = function(s, p, o, v) {
  return {
    x: "fact",
    a: [s, p, o, v === undefined ? true : v]
  };
};


/**
 * A variable
 * @param {string} a name
 * @return {element} element
 */
 var the = function(a) {
  return {
    x: "var",
    a: [a]
  };
};


/**
 * Conjunction
 * @param {term} terms of the conjonction
 * @return {term} term
 */
var and = function() {
  return {
      x: "and",
      a: Array.prototype.slice.call(arguments)
  };
};

/**
 * Disjunction
 * @param {term} terms of the disjunction
 * @return {term} term
 */
var or = function() {
  return {
      x: "or",
      a: Array.prototype.slice.call(arguments)
  };
};

/**
 * Negation
 * @param {term} term to negate
 * @return {term} term
 */
var not = function(a) {
  return {
    x: "not",
    a: [a]
  };
};


/**
 * Implication
 * @param  {term} a
 * @param  {term} b
 * @return {term}
 */
var implies = function(a, b) {
  return or(not(a), b);
};

/**
 * Equivalence
 * @param  {term} a
 * @param  {term} b
 * @return {term}
 */
var equivalent = function(a, b) {
  return and(implies(a, b), implies(b, a));
};

module.exports.fact = fact;
module.exports.the = the;
module.exports.and = and;
module.exports.or = or;
module.exports.not = not;
module.exports.implies = implies;
module.exports.equivalent = equivalent;







/**
 * Query Engine
 * @author Vincent Lecrubier <vincent.lecrubier@gmail.com>
 * @since  2015-04-19
 */



/**
 * Create a query with variables instantiated according to their values in a result
 * @param  query  a query complying with the queryAPI
 * @param  result a partial result
 * @return a query complying with the queryAPI, similar to query, with all the "var" replaced by their value in result.
 * @example
 * createInstantiatedQuery(
 *  {x:"fact",a:[{x:"var",a:["bob"]},"joe","lol"]},
 *  {"bob":"ok"}
 * )
 * // returns {x:"fact",a:["ok","joe","lol"]}
 */
var createInstantiatedQuery = function (query, result) {
  if (query.x === "var") {
    // It is a var, if possible we need to instantiate it.
    if (result.hasOwnProperty(query.a[0])) {
      // We have its value in the result, we instantiate it.
      return result[query.a[0]];
    } else  {
      // We dont have its value, we just clone it.
      return {
        x: "var",
        a: [query.a[0]]
      };
    }
  } else if (query.x !== undefined) {
    // It is an expression, we clone it.
    var newA = [];
    for (var i = 0; i < query.a.length; i++) {
      newA.push(createInstantiatedQuery(query.a[i],result));
    }
    return {
      x: query.x,
      a: newA
    };
  } else {
    // It is a string, leaf of the AST, we clone it.
    return query;
  }
};


// function factorial(n) {
//   if (n <= 0) {
//     return 1;
//   } else {
//     return n * factorial(n - 1);
//   }
// }
//
//
//
// function nthPermutation(atoms, index) {
//   var size = atoms.length;
//     var src = atoms.slice(), dest = [], item;
//     for (var i = 0; i < size; i++) {
//         item = index % src.length;
//         index = Math.floor(index / src.length);
//         dest.push(src[item]);
//         src.splice(item, 1);
//     }
//     return dest;
// }

// ar=["a","b","c","d"];
// for (var i = 0; i < factorial(ar.length); i++) {
//   console.log(nthPermutation(ar,i));
// }






// Merge two result objects
// resultA = {"ok":"good"}
// resultB = {"lol":"wow"}
// result = {"ok":"good","lol":"wow"}
var mergeResults = function(resultA, resultB) {
  var result = {};
  for (var keyA in resultA) {
    if (resultA.hasOwnProperty(keyA)) {
      result[keyA] = resultA[keyA];
    }
  }
  for (var keyB in resultB) {
    if (resultB.hasOwnProperty(keyB)) {
      result[keyB] = resultB[keyB];
    }
  }
  return result;
};



// Cached push. Push an array B to an array A, modifying A.
// cachedPush.apply(A, B);
var cachedPush = Array.prototype.push;



// This function takes a single result, a query, and return a list of result complying with the result and the query
// module = the module to use
// result = {}
// query = and(fact(the("x"),"<","7"),fact(the("x"),">","4"),fact(the("x"),"is","integer"))
// return = [{x:5},{x:6}]
var solveQuery = function(query, result, m) {
  var instantiatedQuery = createInstantiatedQuery(query, result);
  var i,j; // loop index
  var returnValue; // return value
  // for each result in base:
  switch (instantiatedQuery.x) {
    case "fact":
      return solveFact(instantiatedQuery.a, result, m);
    case "and":
      // TODO permutate order if failure ( recursive query return null)
      returnValue = [result];
      for (i = 0; i < instantiatedQuery.a.length; i++) {
        var newReturnValue = [];
        for (j = 0; j<returnValue.length; j++) {
          // Merge the two tables
          cachedPush.apply(newReturnValue, solveQuery(instantiatedQuery.a[i], returnValue[j], m));
        }
        returnValue=newReturnValue;
      }
      return returnValue;
    case "or":
      returnValue = [];
      for (i = 0; i < instantiatedQuery.a.length; i++) {
        cachedPush.apply(returnValue, solveQuery(instantiatedQuery.a[i], result, m));
      }
      return returnValue;
    case "not":
      var res = solveQuery(instantiatedQuery.a[0], result, m);
      if (res===null || res.length > 0) {
        return [];
      } else {
        return [result];
      }
  }
};




// Returns a set of triples matching a single query element
// store = a data store complying to the interface
// fact = [{"var":"bob"},"ok","lol"]
// triples = [["lol","ok","lol"],["joe","ok","lol"]]
// return = [{"bob":"lol"},{"bob":"joe"}]
var solveFact = function(fact, result, m) {
  var triples;
  var returnValue = [];
  if (fact[0].x === "var") {
    if (fact[1].x === "var") {
      if (fact[2].x === "var") {
        triples = m.queryXXX(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[0].a[0]] = triple[0];
            returnElement[fact[1].a[0]] = triple[1];
            returnElement[fact[2].a[0]] = triple[2];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      } else {
        triples = m.queryXXO(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[0].a[0]] = triple[0];
            returnElement[fact[1].a[0]] = triple[1];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      }
    } else {
      if (fact[2].x === "var") {
        triples = m.queryXPX(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[0].a[0]] = triple[0];
            returnElement[fact[2].a[0]] = triple[2];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      } else {
        triples = m.queryXPO(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[0].a[0]] = triple[0];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      }
    }
  } else {
    if (fact[1].x === "var") {
      if (fact[2].x === "var") {
        triples = m.querySXX(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[1].a[0]] = triple[1];
            returnElement[fact[2].a[0]] = triple[2];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      } else {
        triples = m.querySXO(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[1].a[0]] = triple[1];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      }
    } else {
      if (fact[2].x === "var") {
        triples = m.querySPX(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnElement[fact[2].a[0]] = triple[2];
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      } else {
        triples = m.querySPO(fact,m);
        if (triples === null) {
          return null;
        } else {
          triples.forEach(function(triple) {
            var returnElement = {};
            returnValue.push(mergeResults(result, returnElement));
          });
        }
      }
    }
  }
  return returnValue;
};


var query = function(query, m) {
  return solveQuery(query, {}, m);
};

module.exports.query = query;
