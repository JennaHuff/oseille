import PouchDb from 'pouchdb';
import find from 'pouchdb-find';
import { addProduct } from '../entity/product';
import { addCustomer } from '../entity/customer';
import { addDelivery } from '../entity/delivery';

PouchDb.plugin(find);

export let db = new PouchDb('hello_world');

db.allDocs({ include_docs: true }).then(console.log);

export const initDatabase = () => {
  return db.destroy().then(async () => {
    db = new PouchDb('hello_world');

    const p1 = await addProduct({ name: 'Tomate', price: 0.42 });
    const p2 = await addProduct({ name: 'Aubergine', price: 4 });
    const p3 = await addProduct({ name: 'Pasteque', price: 42 });
    const c1 = await addCustomer({ name: 'Biocoop' });
    const c2 = await addCustomer({ name: 'Restaurant super chic' });
    const c3 = await addCustomer({ name: 'Epicerie de parisiens' });
    addDelivery({
      customerId: c1 || '',
      products: [
        { productId: p1 || '', quantity: 17 },
        { productId: p2 || '', quantity: 18 },
        { productId: p3 || '', quantity: 19 },
      ],
    }).catch(console.error);

    db.bulkDocs([{ _id: 'init' }]).catch(console.error);
  });
};
