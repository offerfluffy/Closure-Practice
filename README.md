# 🔍 Closures in JavaScript

## 🧠 Basic Info

A **closure** is the combination of a function and its **lexical environment** (the variables and scope it had access to when it was created). Closures are created **every time a function is declared**, not just when returned from another function.

Closures allow functions to **remember and access** variables from their defining scope even when that function is executed outside of that scope.

### ✅ Simple Example:

```js
function greet(name) {
  return function () {
    console.log(`Hi, ${name}`);
  };
}

const sayHi = greet("Kyrylo");
sayHi(); // Hi, Kyrylo
```

➡️ Even though `greet()` has returned, the inner function still remembers `name`.

---

# 🔍 Deeper Explanation of Closures

A **closure** is created every time a function is created in JavaScript. It's not a special feature—it happens automatically due to **lexical scoping**.

## ✅ What happens internally?

When a function is defined, the JavaScript engine **remembers the scope** in which it was defined. This "remembered scope" is the **lexical environment**, and the function carries it around.

### Example:

```js
function outer() {
  let count = 0;
  return function () {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
```

➡️ Even though `outer()` has finished, its variable `count` is **still alive** inside the returned function—**that’s closure**.

---

# ⚠️ Underwater Rocks: Gotchas & Misconceptions

## 🪨 1. Shared vs. Independent Closures

Be careful when creating closures in loops.

**Wrong (shared closure):**

```js
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function () {
    console.log(i); // always 3
  });
}
funcs[0](); funcs[1](); funcs[2]();
```

**Why?** All functions share the same closure over `i`.

✅ **Fix with `let`** (block scope):

```js
for (let i = 0; i < 3; i++) {
  funcs.push(function () {
    console.log(i); // 0, 1, 2
  });
}
```

---

## 🪨 2. Memory Leaks

Closures **keep references** to outer variables. If you retain closures (e.g. in event listeners or long-lived objects), you might accidentally keep large chunks of memory **alive** longer than necessary.

**Solution:** Clean up unused closures and event listeners.

---

## 🪨 3. Closures in Asynchronous Code

Closures often trap values from **before** an async operation finishes, which can surprise you.

### Example:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 3, 3, 3
  }, 1000);
}
```

✅ Fix with `let`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 0, 1, 2
  }, 1000);
}
```

Or use an IIFE:

```js
for (var i = 0; i < 3; i++) {
  (function(i) {
    setTimeout(() => console.log(i), 1000);
  })(i);
}
```

---

## 🪨 4. Overusing Closures in Object-Oriented Code

Closures can replace classes for encapsulation—but they’re not always better.

### Example:

```js
function Counter() {
  let count = 0;
  return {
    inc() { count++; },
    get() { return count; }
  };
}

const c = Counter();
c.inc();
console.log(c.get()); // 1
```

⚠️ But each instance creates **new copies** of functions and memory, unlike using class methods (which share `prototype`).

---

# ✅ When to Use Closures

Use closures when you want to:

* **Encapsulate** private data
* **Create function factories** (return functions configured with specific values)
* **Preserve state** between function calls
* **Handle asynchronous logic** safely
