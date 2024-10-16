import './App.css';
import { c__, d__ } from 'https://cdn.jsdelivr.net/gh/a-bentofreire/jstracetoix@1.1.0/component/jstracetoix.mjs';

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