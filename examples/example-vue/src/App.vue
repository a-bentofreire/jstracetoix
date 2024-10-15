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
import { c__, d__ } from 'jstracetoix/component/jstracetoix.mjs'

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
