import { c__, d__ } from 'jstracetoix';

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