import { relDb } from '../service/database';
import { store } from '../service/store';
import { Customer, loadCustomer } from './customer';
import { Product, loadProduct } from './product';
import { documentIdFormatter } from '../../utils/formatter';
import { updateDocumentId } from './farm';

export interface Delivery {
  id: string;
  customer: Customer;
  documentId: string;
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

export async function loadDeliveries() {
  const result = await relDb.rel.find('delivery');
  store.deliveries = result.deliveries;
  // .sort((a: Customer, b: Customer) => {
  //   return a.name.localeCompare(b.name);
  // });
}

export const addDelivery = async (delivery: DeliveryInput) => {
  const customer = await loadCustomer(delivery.customerId);
  console.log({ customer });
  const promise = async () => {
    const products = await Promise.all(
      delivery.products.map(async (el) => {
        const product = await loadProduct(el.productId);
        return { ...el, product };
      }),
    );
    return { ...delivery, customer, products };
  };

  promise().then((deliveryFull) => {
    relDb.rel
      .save('delivery', { ...deliveryFull, documentId: documentIdFormatter(store.farm?.deliveryId || 0, 'Delivery') })
      .then(() => {
        updateDocumentId('Delivery');
      })
      .catch(console.error);
  });
};

export const addInvoiceId = (invoiceId: string, deliveryId: string) => {
  relDb.rel
    .find('delivery', deliveryId)
    .then((result) => {
      const delivery = result.deliveries[0];
      relDb.rel.save('delivery', { ...delivery, invoiceId }).catch(console.error);
    })
    .catch(console.error);
};
