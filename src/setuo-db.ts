import { Client } from 'pg';
import { faker } from '@faker-js/faker';
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: 'test-2',
  password: process.env.DB_PASSWORD,
  port: 5440,
});

const USERS = 100_000;
const ORDERS = 500_000;
const ORDER_ITEMS = 1_000_000;
const BATCH_SIZE = 1000;

async function insertBatch(query: string, values: any[][]) {
  const text = `${query} VALUES ${values.map((_, i) => `(${values[i].map((_, j) => `$${i * values[0].length + j + 1}`).join(', ')})`).join(', ')}`;
  const flatValues = values.flat();
  await client.query(text, flatValues);
}

async function setup(): Promise<void> {
  await client.connect();

  console.log('Dropping existing tables...');
  await client.query(`
    DROP TABLE IF EXISTS users, orders, order_items, products, categories, brands, payments, shippers, locations, warehouses,analyzed_by_orders, analyzed_by_products CASCADE;
  `);

  console.log('Creating tables...');
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT
    );

    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      name TEXT
    );

    CREATE TABLE brands (
      id SERIAL PRIMARY KEY,
      name TEXT
    );

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT,
      brand_id INT,
      category_id INT,
      CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
      CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
    CREATE INDEX idx_products_brand_id ON products(brand_id);
    CREATE INDEX idx_products_category_id ON products(category_id);

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INT,
      CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP
    );
    CREATE INDEX idx_orders_user_id ON orders(user_id);
    CREATE INDEX idx_orders_created_at ON orders(created_at);

    CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INT,
      product_id INT,
      CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      quantity INT
    );
    CREATE INDEX idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX idx_order_items_product_id ON order_items(product_id);

    CREATE TABLE payments (
      id SERIAL PRIMARY KEY,
      order_id INT,
      CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      amount NUMERIC,
      method TEXT
    );
    CREATE INDEX idx_payments_order_id ON payments(order_id);

    CREATE TABLE shippers (
      id SERIAL PRIMARY KEY,
      name TEXT
    );

    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      address TEXT
    );

    CREATE TABLE warehouses (
      id SERIAL PRIMARY KEY,
      location_id INT,
      CONSTRAINT fk_warehouse_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
      name TEXT
    );
     CREATE INDEX idx_warehouses_location_id ON warehouses(location_id);
  `);
  console.log('Tables created successfully.');
  console.log('Creating indexes...');
  console.log('Inserting base data...');
  for (let i = 0; i < 10; i++) {
    await Promise.all([
      client.query('INSERT INTO categories (name) VALUES ($1)', [
        faker.word.noun(),
      ]),
      client.query('INSERT INTO brands (name) VALUES ($1)', [
        faker.company.name(),
      ]),
      client.query('INSERT INTO shippers (name) VALUES ($1)', [
        faker.company.name(),
      ]),
      client.query('INSERT INTO locations (address) VALUES ($1)', [
        faker.location.streetAddress(),
      ]),
    ]);
  }

  for (let i = 0; i < 10; i++) {
    await client.query(
      'INSERT INTO warehouses (location_id, name) VALUES ($1, $2)',
      [Math.ceil(Math.random() * 10), faker.commerce.department()],
    );
  }
  console.log('Base data inserted successfully.');
  for (let i = 0; i < 10; i++) {
    await client.query(
      'INSERT INTO products (name, brand_id, category_id) VALUES ($1, $2, $3)',
      [
        faker.commerce.productName(),
        Math.ceil(Math.random() * 10),
        Math.ceil(Math.random() * 10),
      ],
    );
  }
  console.log('Inserting data batches...');
  for (let i = 0; i < USERS; i += BATCH_SIZE) {
    const batch = Array.from({ length: BATCH_SIZE }, () => [
      faker.person.fullName(),
      faker.internet.email(),
    ]);
    await insertBatch('INSERT INTO users (name, email)', batch);
  }

  for (let i = 0; i < ORDERS; i += BATCH_SIZE) {
    const batch = Array.from({ length: BATCH_SIZE }, () => [
      Math.ceil(Math.random() * USERS),
      faker.date.past(),
    ]);
    await insertBatch('INSERT INTO orders (user_id, created_at)', batch);
  }

  for (let i = 0; i < ORDER_ITEMS; i += BATCH_SIZE) {
    const batch = Array.from({ length: BATCH_SIZE }, () => [
      Math.ceil(Math.random() * ORDERS),
      Math.ceil(Math.random() * 10),
      Math.ceil(Math.random() * 5),
    ]);
    await insertBatch(
      'INSERT INTO order_items (order_id, product_id, quantity)',
      batch,
    );
  }

  for (let i = 1; i <= ORDERS; i += BATCH_SIZE) {
    const batch: [number, number, string][] = [];
    for (
      let orderId = i;
      orderId < i + BATCH_SIZE && orderId <= ORDERS;
      orderId++
    ) {
      if (Math.random() < 0.9) {
        const amount = Math.ceil((50 + Math.random() * 1000000) / 1) * 1;
        let method;
        if (amount < 300000) {
          method = 'Cash';
        } else if (amount < 600000) {
          method = 'Credit Card';
        } else {
          method = 'PayPal';
        }

        batch.push([orderId, amount, method]);
      }
    }

    if (batch.length > 0) {
      await insertBatch(
        'INSERT INTO payments (order_id, amount, method)',
        batch,
      );
    }
  }
  await client.end();
}

setup().catch((err) => {
  console.error('Error during setup:', err);
});
