# Description

![NPM Version](https://img.shields.io/npm/v/jstracetoix)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-bentofreire/jstracetoix/.github%2Fworkflows%2Fnpm-package.yml)

[JsTraceToIX](https://www.devtoix.com/en/projects/jstracetoix) is an expression tracer for debugging React or Vue components, arrow functions, method chaining, and expressions in general.

Code editors typically cannot set breakpoints within such expressions, requiring significant code changes to debug.

JsTraceToIX provides a straightforward solution to this problem.

It was designed to be simple, with easily identifiable functions that can be removed once the bug is found.

JsTraceToIX has 2 major functions:
- `c__` capture the input of an expression input. ex: `c__(x)`
- `d__` display the result of an expression and all the captured inputs. ex: `d__(c__(x) + c__(y))`

And 2 optional functions:
- `init__` initializes display format, output stream, multithreading, enable/disable processing `c__`, `d__` and `t__`.
- `t__` defines a name for the current thread.

If you find this project useful, please, read the [Support this Project](https://www.devtoix.com/en/projects/jstracetoix#support-this-project) on how to contribute.

## Features

- No external dependencies.
- Runs on Node.js (es6 module and commonjs), browsers, React components, and Vue components.
- Minimalist function names that are simple and short.
- Traces Results along with Inputs.
- Configurable Result and Input naming.
- Outputs to console.debug on browsers, React and Vue, and to a stream on Node.js.
- Supports multiple levels.
- Capture Input method with customizable `allow` and `name` callbacks.
- Display Result method with customizable `allow`, `before`, and `after` callbacks.
- Support to globally disable the processing `c__`, `d__`, `t__`.
- Result and Inputs can be reformatted and overridden.
- Configurable [formatting](https://www.devtoix.com/en/projects/jstracetoix#formatting) at both global and function levels.
- Supports [Multithreading](https://www.devtoix.com/en/projects/jstracetoix#multithreading).

## Python Version

This package is also available in Python for similar debugging purposes. The Python version, called **PyTraceToIX**, allows tracing input and output values during debugging and can be found on [PyTraceToIX](https://www.devtoix.com/en/projects/pytracetoix).

It offers the same `c__` and `d__` tracing functionality for Python, providing a seamless debugging experience across both languages.

## Installation

| Environment | Require Installation |
| ----- | ------------------- |
| Browser | No  |
| Node.js | Yes |
| React | Optional |
| Vue | Yes |

```bash
npm install jstracetoix --save-dev
```

## React Usage

In this example:
- `cityTax` arrow function captures the input price and names it 'Price'.
- On `ShoppingList` function:
  - `c__` captures the title in the first `<td>`.
  - `c__` captures the output of the cityTax and names it `CityTax` in the 2nd `<td>`.
  - `d__` displays the aggregated information in a single line: title, price, cityTax, total Price.

The `d__` will generate this output:

```plaintext
i0:`Rice` | Price:`10` | CityTax:`5` | _:`15`
i0:`Coffee` | Price:`30` | CityTax:`15` | _:`45`
i0:`Shoes` | Price:`100` | CityTax:`15` | _:`115`
```

```javascript
import './App.css';
// Without local installation
import { c__, d__ } from 'https://cdn.jsdelivr.net/gh/a-bentofreire/jstracetoix@1.2.1/component/jstracetoix.mjs';

// If it's installed locally via "npm install jstracetoix --save-dev"
// import { c__, d__ } from 'jstracetoix/component';

const cityTax = (price) => c__(price, {name: 'Price'}) > 20 ? 15 : 5;
const products = [
    { title: 'Rice', price: 10, id: 1 },
    { title: 'Coffee', price: 30, id: 2 },
    { title: 'Shoes', price: 100, id: 3 },
];

function ShoppingList() {
    const listItems = products.map(product =>
        <tr key={product.id}>
            <td>{c__(product.title)}</td>
            <td>{d__(product.price + c__(cityTax(product.price), { name: 'CityTax' }))}</td>
        </tr>
    );

    return (
        <table><tbody>{listItems}</tbody></table>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <ShoppingList />
            </header>
        </div>
    );
}

export default App;
```

## Browser Usage

This example is similar to the React example, but instead the products are collected from a remote JSON.
- `c__` captures the price and the tax, and names `tax` the 2nd input.
- `d__` displays the aggregate information if `tax` is 0.15.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product List</title>
  <script src="https://cdn.jsdelivr.net/gh/a-bentofreire/jstracetoix@1.2.1/browser/jstracetoix.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <style>
    table { width: 50%; border-collapse: collapse; margin: 20px auto; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>

<body>
  <h2 style="text-align:center;">Product List</h2>
  <table id="productTable">
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  <script>
    const tax = (price) => price > 40 ? 0.15 : 0.10;

    axios.get('https://cdn.jsdelivr.net/gh/a-bentofreire/jstracetoix@1.2.1/examples/products.json')
      .then(function (response) {
        const products = response.data;
        const tableBody = document.querySelector('#productTable tbody');
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${c__(product.name)}</td>`
            + `<td>$${d__(c__(product.price) * (1 + c__(tax(product.price), { name: 'tax' })),
              { allow: (data) => data['tax'] === 0.15 }).toFixed(2)}</td>`;
          tableBody.appendChild(row);
        });
      })
      .catch(function (error) {
        console.error('Error fetching the product list:', error);
      });
  </script>
</body>
</html>
```

## Vue Usage

- This example is similar to the React example.

```html
<template>
  <div class="App">
    <header class="App-header">
      <table>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ c__(product.title) }}</td>
            <td>{{ d__(product.price + c__(cityTax(product.price), { name: 'CityTax' })) }}</td>
           </tr>
        </tbody>
      </table>
    </header>
  </div>
</template>

<script>
import { c__, d__ } from 'jstracetoix/component'

export default {
  name: 'App',
  data() {
    return {
      products: [
        { title: 'Rice', price: 10, id: 1 },
        { title: 'Coffee', price: 30, id: 2 },
        { title: 'Shoes', price: 100, id: 3 },
      ]
    };
  },
  methods: {
    c__(value, options = {}) { return c__(value, options); },
    d__(value, options = {}) { return d__(value, options); },
    cityTax(price) {
      return c__(price, { name: 'Price' }) > 20 ? 15 : 5;
    }
  }
};
</script>

<style>
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}
</style>
```

## Node.js Usage

| Format | Usage |
|-|-|
| es6 module | `import { c__, d__ } from 'jstracetoix'` |
| commonjs | `const { c__, d__ } = require('jstracetoix');` |

In this example:
- `c__`.`allow()` - overrides the input value being debugged when value > 40.00,  
  for other values it doesn't captures the input.
- `d__`.`allow()` - overrides the result value being debugged.
- `d__`.`after()` - stops the program after displaying the result and the captured fields.

```javascript
// from a es6 module
import { c__, d__ } from 'jstracetoix';
// from a "commonjs" file
// const { c__, d__ } = require('jstracetoix');

const products = [
    { "name": "Smartphone 128GB", "price": 699.00 },
    { "name": "Coffee Maker", "price": 49.99 },
    { "name": "Electric Toothbrush", "price": 39.95 },
    { "name": "4K Ultra HD TV", "price": 999.99 },
    { "name": "Gaming Laptop", "price": 1299.00 }];

const factor = (price) => price < 1000 ? 1.10 : 1;

const prices = d__(products.map(product => c__(product.price,
    {
        allow: (index, name, value) => value > 40.00 ?
            Math.floor(value * factor(value)) : false,
        name: product.name.substring(0, 10)
    })), {
    allow: (data) => data._.map((v, i) => `${i}:${v}`),
    after: (data) => process.exit() // exits after displaying the results
});
// Smartphone:`768` | Coffee Mak:`54` | 4K Ultra H:`1099` | Gaming Lap:`1299` | _:`["0:699","1:49.99","2:39.95","3:999.99","4:1299"]`

// this code is unreachable
for (const price in prices) {
    let value = price;
}
```

## Detailed Usage and Examples

```javascript
import { c__, d__, init__, t__ } from 'jstracetoix';

let [x, y, w, k, u] = [1, 2, 3, 4 + 4, (x) => x];

// Expression evaluation
let z = x + y * w + (k * u(5));

// Display expression result without inputs
z = d__(x + y * w + (k * u(5)));
// Output:
// _:`47`

// Display expression result with inputs
z = d__(c__(x) + y * c__(w) + (k * u(5)));
// Output:
// i0:`1` | i1:`3` | _:`47`

// Display expression result with nested inputs
z = d__(c__(x) + y * c__(w) + d__(k * c__(u(5), { level: 1 })));
// Output:
// i0:`5` | _:`40`
// i0:`1` | i1:`3` | _:`47`

// Arrow function
let f = (x, y) => x + (y + 1);
f(5, 6);

// Display Arrow function result and inputs
f = (x, y) => d__(c__(x) + c__(y + 1));
f(5, 6);
// Output:
// i0:`5` | i1:`7` | _:`12`

// Display Arrow function inputs and result with custom input and result names
f = (x, y) => d__(c__(x, { name: 'x' }) + c__(y + 1, { name: 'y+1' }), { name: 'f' });
f(5, 6);
// Output:
// x:`5` | y+1:`7` | f:`12`

// Method chaining
let l = [[10, 20], [30, 40]].map(([x, y]) => 5 * y * x);

// Display method chaining with custom input and result names
l = d__([[10, 20], [30, 40]].map(([x, y]) =>
    5 * c__(y, { name: `y${y}` }) * c__(x, { name: (index) => `v${index}` })
));
// Output:
// y20:`20` | v1:`10` | y40:`40` | v3:`30` | _:`[1000, 6000]`

// Conditional display based on input count
d__(c__(x) + c__(y), { allow: (data) => data.input_count__ === 2 });
// Output:
// i0:`1` | i1:`2` | _:`3`

// Conditional display based on first input value
d__(c__(x) + c__(y), { allow: (data) => data.i0 === 10.0 });
// No output

// Conditional display with override based on input count
d__(c__(x, { allow: (index, name, value) => value > 10 }) + c__(y), {
    allow: (data) => data.allow_input_count__ === 2
});
// No output

// Method chaining with custom condition before display
d__(['10', '20'].map(x => c__(x)), { before: (data) => data.output__.includes('10') });
// Output:
// i0:`10` | i1:`20` | _:`["10","20"]`


// Method chaining with condition and after-call
d__(['10', '20'].map(x => c__(x)), {
    allow: (data) => data.allow_input_count__ === 2,
    after: (data) => callAfter(data) ? "" : ""
});
// Output:
// i0:`10` | i1:`20` | _:`["10","20"]`

// Method chaining with allow input override
d__([['10', '20'], ['30', '40'], ['50', '60']].map((x) => c__(x, { allow: (index, name, value) => value[0] })));
// Output:
// i0:`10` | i1:`30` | i2:`50` | _:`[["10","20"],["30","40"],["50","60"]]`

// Method chaining with allow result override
d__([['10', '20'], ['30', '40'], ['50', '60']].map((x) => c__(x)), { allow: (data) => data._.slice(0, 2) });
// Output:
// i0:`["10","20"]` | i1:`["30","40"]` | i2:`["50","60"]` | _:`[["10","20"],["30","40"]]`

// Chain class with map and filter methods
class Chain {
    constructor(data) {
        this.data = data;
    }

    map(func) {
        this.data = this.data.map(func);
        return this;
    }

    filter(func) {
        this.data = this.data.filter(func);
        return this;
    }
}

// Using the Chain class
new Chain([10, 20, 30, 40, 50]).map(x => x * 2).filter(x => x > 70);

// Display the chain results with captured inputs and results
d__(new Chain([10, 20, 30, 40, 50]).map(x => c__(x * 2)).filter(x => c__(x > 70)).data);
// Output:
// i0:`20` | i1:`40` | i2:`60` | i3:`80` | i4:`100` | i5:`false` | i6:`false` | i7:`false` | i8:`true` | i9:`true` | _:`[80,100]`
```

## Formatting

The `d__` function can override the default formatting, and it can also be defined at global level.

```javascript
import { c__, d__, init__, t__ } from 'jstracetoix';

init__({format={
    result: '{name}:`{value}`',
    input: '{name}:`{value}`',
    thread: '{id}: ',
    sep: ' | ',
    new_line: true
}})
```

Formatting parameters:
- `result`: The result value format will be displayed.
- `input`: The input value format will be displayed.
- `thread`: The thread Id format will be displayed. (Node.js only).
- `sep`: The separator text between each input and the result.
- `new_line`: If `true` it will add a new line at the end of output.

## Multithreading

To activate the multithreading support (Node.js only):

```javascript

import { Worker, isMainThread, workerData } from 'worker_threads';
import { c__, d__, init__, t__ } from 'jstracetoix';

// Initializing with multithreading
init__({ multithreading: true });

// It displays the threadId: i0: `4` | _: `5`
const threadFunction = () => {
    d__(c__(4) + 1);
};

// It displays the something: i0: `4` | _: `5`
const threadFunctionWithName = () => {
    t__('something');
    d__(c__(4) + 1);
};

if (isMainThread) {
    const threads = [];

    // Create 5 workers
    for (let i = 0; i < 5; i++) {
        const worker = new Worker(__filename);
        threads.push(worker);
    }

    const workerWithName = new Worker(__filename, { workerData: { withName: true } });
    threads.push(workerWithName);
    threads.forEach(thread => {
        thread.on('message', message => {
            console.log('From worker:', message);
        });

        thread.on('exit', () => {
            console.log('Thread finished');
        });
    });

} else {
    if (workerData && workerData.withName) {
        threadFunctionWithName();
    } else {
        threadFunction();
    }
}
```

## Output

| Environment | Default Output Function |
| ----- | ------------------- |
| Browser | console.debug  |
| Node.js | process.stdout |
| React | console.debug |
| Vue | console.debug |

Except for Node.js environment, the output is displayed in the browser's developer tools under the "Console Tab".
Since the output is generated using `console.debug`, it can easily be filtered out from regular `console.log` messages.  
The default output function can be override using `init__({'stream': new_stream.log })`

## Metadata

 The `d__` function callbacks `allow`, `before` and `after` will receive a parameter `data` with the allowed inputs plus the following `meta` items:

- `meta__`: list of meta keys including the name key.
- `thread_id__`: thread_id being executed
- `allow_input_count__`: total number of inputs that are allowed.
- `input_count__`: total number of inputs being captured.
- `allow__`: If false it wasn't allowed. Use this for `after` callback.
- `output__`: Text passed to `before` without `new_line`.
- name: name parameter

## Documentation

 [Package Documentation](https://www.devtoix.com/docs/jstracetoix/en/)

## Support this Project

If you find this project useful, consider supporting it:

- Donate:

[![Donate via PayPal](https://www.paypalobjects.com/webstatic/en_US/i/btn/png/blue-rect-paypal-34px.png)](https://www.paypal.com/donate/?business=MCZDHYSK6TCKJ&no_recurring=0&item_name=Support+Open+Source&currency_code=EUR)

[![Buy me a Coffee](https://www.devtoix.com/assets/buymeacoffee-small.png)](https://buymeacoffee.com/abentofreire)

- Visit the project [homepage](https://www.devtoix.com/en/projects/jstracetoix)
- Give the project a ⭐ on [Github](https://github.com/a-bentofreire/jstracetoix)
- Spread the word
- Follow me:
  - [Github](https://github.com/a-bentofreire)
  - [LinkedIn](https://www.linkedin.com/in/abentofreire)
  - [Twitter/X](https://x.com/devtoix)

## License

MIT License

## Copyrights

(c) 2024 [Alexandre Bento Freire](https://www.a-bentofreire.com)
