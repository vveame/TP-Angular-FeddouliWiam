/**
 * fetch-dummyjson-to-products.js
 * 
 * Usage:
 *    npm install node-fetch
 *    node fetch-dummyjson-to-products.js
 * 
 * Output:
 *    Creates/overwrites `products.json` in the same folder.
 */

import fs from 'fs/promises';

/**
 * Adjust this if using Node <18:
 * import fetch from 'node-fetch';
 */

async function main() {
  try {
    console.log('⏳ Fetching products from DummyJSON...');
    const res = await fetch('https://dummyjson.com/products?limit=0');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { products } = await res.json();  // Array of DummyJSON products
    console.log(`✅ Retrieved ${products.length} products.`);

    const mapped = products.map(d => ({
      productId: String(d.id),
      productTitle: d.title,
      productPrice: d.price,
      productQuantity: d.stock,
      productImage: d.thumbnail,
      productCategory: d.category,
      restockDate: null
    }));

    // Optionally wrap mapped in class instances:
    // import { Product } from './Product.js';
    // const final = mapped.map(data => Product.fromJSON(data));

    const out = JSON.stringify(mapped, null, 2);
    await fs.writeFile('products.json', out, 'utf-8');
    console.log('✅ Saved products.json to disk.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exitCode = 1;
  }
}

main();