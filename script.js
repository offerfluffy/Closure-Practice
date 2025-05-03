// Closuers
/*
  A closure is a combination of a function and its lexical environment (LE)
  meaning the function remembers the variables from the scope in which it was created, even after that outer function has finished execution.

  A closure gives access to an outer function's scope from an inner function,
  even after the outer function has returned.
*/

/* 
  Closures:
  - Are formed when a function retains access to its lexical scope.
  - Let you create private variables and configure functions dynamically.
  - Are heavily used in callbacks, event handlers, and functional patterns.
*/

function outer(name) {

  function inner() {
    console.log(`Hi, ${name}`);
  }

  function inner2() {
    console.log(`${name} feels good`);
  }

  /*
  inner();
  inner2();
  */

  return {
    inner,
    inner2
  }
}

const obj = outer("me");

obj.inner()
obj.inner2()

// Practical example
const onClick12 = makeClickHandler(12);
const onClick14 = makeClickHandler(14);
const onClick16 = makeClickHandler(16);

function makeClickHandler(size) {
  return function () {
    document.body.style.fontSize = `${size}px`;
  };
}