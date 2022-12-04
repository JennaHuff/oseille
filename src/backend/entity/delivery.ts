import { db } from '../service/database';
import { store } from '../service/store';
import { Customer } from './customer';
import { Product } from './product';
import { documentIdFormatter } from '../../utils/formatter';
import { updateDocumentId } from './farm';

export interface Delivery {
  _id: string;
  type: 'Delivery';
  customer: Customer;
  products: Array<{
    product: Product;
    quantity: number;
    totalPrice: number;
  }>;
}

export interface DeliveryInput {
  customerId: string;
  products: Array<{
    productId: string;
    quantity: number;
    totalPrice?: number;
  }>;
}

export const loadDeliveries = (id?: string) => {
  db.find({
    selector: { type: 'Delivery' },
  }).then((result) => {
    store.deliveries = result.docs as unknown as Delivery[];
  });
  return id;
};

export const addDelivery = async (delivery: DeliveryInput) => {
  const customer = await db.get(delivery.customerId);
  const promise = async () => {
    const products = await Promise.all(
      delivery.products.map(async (el) => {
        const product = await db.get(el.productId);
        return { ...el, product };
      }),
    );
    return { ...delivery, customer, products };
  };

  promise().then((deliveryFull) => {
    db.post({
      ...deliveryFull,
      documentId: documentIdFormatter(store.farm?.deliveryId || 0, 'Delivery'),
      type: 'Delivery',
    })
      .then(console.log)
      .then(() => loadDeliveries())
      .then(() => {
        updateDocumentId('Delivery');
      })
      .catch(console.error);
  });
};
