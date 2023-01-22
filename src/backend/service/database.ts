import PouchDb from 'pouchdb';
import find from 'pouchdb-find';
import { addCustomer, loadCustomers } from '../entity/customer';
import { addDelivery, loadDeliveries } from '../entity/delivery';
import { addFarm, loadFarm } from '../entity/farm';
import { loadInvoices } from '../entity/invoice';
import { addProduct, loadProducts } from '../entity/product';

PouchDb.plugin(find);

const DB_NAME = 'hello_world';

export let db = new PouchDb(DB_NAME);

db.allDocs({ include_docs: true }).then(console.log);

let debounce: NodeJS.Timeout;

export const initDatabase = () => {
  return db.destroy().then(async () => {
    db = new PouchDb(DB_NAME);
    db.changes({
      since: 'now',
      live: true,
    })
      .on('change', function (change) {
        console.log('CHANGE', change);
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          loadDatabase();
        }, 300);
      })
      .on('error', function (err) {
        console.log('ERROR', err);
      });
    await addFarm();

    const p1 = await addProduct({ name: 'Tomate', price: 0.42, unit: 'kg' });
    const p2 = await addProduct({ name: 'Aubergine', price: 4, unit: 'kg' });
    const p3 = await addProduct({ name: 'Pasteque', price: 42, unit: 'piece' });
    const c1 = await addCustomer({
      name: 'Biocoop',
      address1: '1 rue du potiron',
      address2: '',
      zip: '33000',
      city: 'Bordeaux',
    });
    const c2 = await addCustomer({
      name: 'Restaurant super chic',
      address1: "1 rue de l'endive",
      address2: '',
      zip: '33000',
      city: 'Bordeaux',
    });
    const c3 = await addCustomer({
      name: 'Epicerie de parisiens',
      address1: '1 rue du topinambour',
      address2: '',
      zip: '33000',
      city: 'Bordeaux',
    });
    addDelivery({
      customerId: c1 || '',
      products: [
        { productId: p1 || '', quantity: 17 },
        { productId: p2 || '', quantity: 18.5 },
        { productId: p3 || '', quantity: 19 },
      ],
    }).catch(console.error);

    addDelivery({
      customerId: c2 || '',
      products: [
        { productId: p1 || '', quantity: 1 },
        { productId: p2 || '', quantity: 2 },
      ],
    }).catch(console.error);

    addDelivery({
      customerId: c3 || '',
      products: [
        { productId: p2 || '', quantity: 3 },
        { productId: p3 || '', quantity: 4 },
      ],
    }).catch(console.error);

    db.bulkDocs([{ _id: 'init' }]).catch(console.error);
  });
};

export const loadDatabase = () => {
  console.log('LOAD DATABASE');
  loadCustomers();
  loadProducts();
  loadDeliveries();
  loadInvoices();
  loadFarm();
};

export const destroyDatabase = () => {
  return db.destroy().then(() => {
    db = new PouchDb(DB_NAME);
    loadDatabase();
  });
};
