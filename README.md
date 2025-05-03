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

--- 

# The Difference Between `let` and `var` in Loops with Closures

In JavaScript, `let` and `var` handle scoping very differently, especially when used in loops with closures. Understanding this difference is crucial for avoiding unexpected behavior in your code.

## 🔥 What Happens with `var`

When you use `var` inside a loop, there is **one shared variable** across all iterations. This happens because `var` is **function-scoped** (or globally scoped if not in a function), which means the same `i` variable is shared by all iterations of the loop. This can cause unexpected results when closures are involved.

```js
const funcs = [];

for (var i = 0; i < 3; i++) {
  funcs.push(function () {
    console.log(i);
  });
}

// Later…
funcs[0](); // 3
funcs[1](); // 3
funcs[2](); // 3
```

**What happens internally:**

1. **One function-scope binding for `i`:**

   * The `i` variable is declared once, outside the loop, and is shared by every closure.

2. **Loop executes synchronously:**

   * In each iteration, the closure is pushed into the `funcs` array. However, all closures reference **the same** `i`.

3. **End of loop (`i = 3`):**

   * By the time the closures execute, `i` has reached 3, and every closure refers to this same `i`, which holds the final value of 3.

Thus, all calls to the closures will log `3` instead of the expected `0`, `1`, and `2`.

---

## ✅ What Happens with `let`

When you use `let`, it creates a **new binding** for each iteration of the loop. This happens because `let` is **block-scoped**, meaning a new variable is created for every iteration of the loop. This allows closures to capture the correct value of `i` at each iteration.

```js
const funcs = [];

for (let i = 0; i < 3; i++) {
  funcs.push(function () {
    console.log(i);
  });
}

// Later…
funcs[0](); // 0
funcs[1](); // 1
funcs[2](); // 2
```

**What happens internally:**

1. **A new binding for `i` in each iteration:**

   * With `let`, a **new `i` variable** is created for each iteration of the loop. Each closure closes over its own unique `i`, which holds the value specific to that iteration.

2. **Loop executes synchronously:**

   * Just like with `var`, the loop runs synchronously and schedules the closures. But, because `let` is block-scoped, each closure **captures its own version of `i`**.

3. **End of loop (`i = 3`):**

   * Each closure has its own binding to `i` from its specific iteration, so the closures will log `0`, `1`, and `2` as expected.

---

## Summary

| Situation         | `var` Behavior                         | `let` Behavior                                      |
| ----------------- | -------------------------------------- | --------------------------------------------------- |
| **Scope**         | Function-scoped (one shared variable)  | Block-scoped (new variable each iteration)          |
| **Loop Behavior** | All closures share the same `i`        | Each closure gets its own `i`                       |
| **Outcome**       | All closures log the final value (`3`) | Closures log values from each iteration (`0, 1, 2`) |

### 🔍 Why This Happens

* **`var` is function-scoped**, meaning the same variable (`i`) is used throughout the entire function or global scope. When you define closures in a loop using `var`, they all point to the same `i`, which causes them to share the final value of `i` after the loop finishes.
* **`let` is block-scoped**, meaning a new `i` is created in each iteration of the loop. Each closure captures a unique `i` that corresponds to its specific iteration.

### ⚠️ Pitfall with `var`

If you use `var` in loops with closures, you may unintentionally cause all closures to share the same variable, leading to unexpected results. To avoid this, always use `let` when you need each closure to capture a different value.