
function selog(v) {
    console.log(v);
    return v;
}
const callAfter = (s) => true;

// ---------------------------- Copy From Here ----------------------------------------

import { c__, d__, init__, t__ } from '../node/jstracetoix.mjs';

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
