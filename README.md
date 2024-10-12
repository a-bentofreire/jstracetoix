# Description

![NPM Version](https://img.shields.io/npm/v/jstracetoix)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-bentofreire/jstracetoix/.github%2Fworkflows%2Fnpm-package.yml)

[JsTraceToIX](https://www.devtoix.com/en/projects/jstracetoix) is an expression tracer for debugging arrow functions, method chaining, and expressions.

Code editors can't set breakpoints inside expressions, arrow functions, and chained methods, forcing significant code changes to debug such code.

JsTraceToIX provides a straightforward solution to this problem.

It was designed to be simple, with easily identifiable functions that can be removed once the bug is found.

JsTraceToIX has 2 major functions:
- `c__` capture the input of an expression input. ex: `c__(x)`
- `d__` display the result of an expression and all the captured inputs. ex: `d__(c__(x) + c__(y))`

And 2 optional functions:
- `init__` initializes display format, output stream and multithreading.
- `t__` defines a name for the current thread.

If you find this project useful, please, read the [Support this Project](https://www.devtoix.com/en/projects/jstracetoix#support-this-project) on how to contribute.

This package is also available for Python on pypi.org as [PyTraceToIX](https://www.devtoix.com/en/projects/pytracetoix).

## Features

- Runs on Node.js and in the browser.
- [Multithreading](https://www.devtoix.com/en/projects/jstracetoix#multithreading) support.
- Simple and short minimalist function names.
- Result with Inputs tracing.
- Configurable [formatting](https://www.devtoix.com/en/projects/jstracetoix#formatting) at global level and at function level.
- Configurable result and input naming.
- Output to the stdout or a stream.
- Multiple levels.
- Capture Input method with `allow` and `name` callback.
- Display Result method with `allow`, `before` and `after` callbacks.
- Input and Result output can be formatted and overridden.

## Installation - Node.js

```bash
npm install jstracetoix --save-dev
```

## Running in the Browser

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <script src="https://raw.githubusercontent.com/a-bentofreire/jstracetoix/refs/heads/master/browser/jstracetoix.js"></script>
    <script>
        d__(c__(5) + 1);
    </script>
</head>

<body>
</body>

</html>
```

## Usage

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
- `input`: The result value format will be displayed.
- `sep`: The separator text between each input and the result.
- `new_line`: If True it will add a new line at the end of output.

## Multithreading

To activate the multithreading support:

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

## Metadata

 The `allow`, `before` and `after` will receive a parameter `data` with the allowed inputs plus the following `meta` items:

- `meta__`: list of meta keys including the name key.
- `thread_id__`: thread_id being executed
- `allow_input_count__`: total number of inputs that are allowed.
- `input_count__`: total number of inputs being captured.
- `allow__`: If false it was allowed. Use this for `after` callback.
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
