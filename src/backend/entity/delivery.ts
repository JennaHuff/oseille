import { documentIdFormatter } from '../../utils/formatter';
import { relDb } from '../service/database';
import { store } from '../service/store';
import { Customer, getCustomer } from './customer';
import { loadFarm, updateDocumentId } from './farm';
import { ProductWithPrice, loadProduct } from './product';

export interface Delivery {
  id: string;
  isTVA: boolean;
  deliveredAt: string;
  customer: Customer;
  customerId: string;
  documentId: string;
  invoiceId?: string;
  lines: Array<DeliveryLine>;
  notes: string;
}

export interface DeliveryLine {
  product: ProductWithPrice;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface DeliveryInput {
  isTVA: boolean;
  customerId: string;
  deliveredAt: string;
  lines: Array<DeliveryLineInput>;
  notes: string;
}

export interface DeliveryLineInput {
  productId: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

export async function loadDeliveries() {
  const result = await relDb.rel.find('delivery');
  store.deliveries = result.deliveries
    .map((delivery: Delivery) => ({
      ...delivery,
      deliveredAt: new Date(delivery.deliveredAt).toISOString().split('T')[0],
    }))
    .sort((a: Delivery, b: Delivery) => a.documentId.localeCompare(b.documentId));
}

export const addDelivery = async (delivery: DeliveryInput) => {
  const customer = await getCustomer(delivery.customerId);
  await loadFarm();
  const promise = async () => {
    const lines = await Promise.all(
      delivery.lines.map(async (el) => {
        const product = await loadProduct(el.productId);
        return { ...el, product: { ...product, price: +el.price || 0 } };
      }),
    );
    return {
      ...delivery,
      isTVA: store.farm?.isTVA === 'oui',
      customer,
      lines: lines.filter((p) => !!p).map((l) => ({ ...l, quantity: +l.quantity })),
    };
  };
  try {
    const deliveryFull = await promise();

    const result = await relDb.rel.save('delivery', {
      ...deliveryFull,
      documentId: documentIdFormatter(store.farm?.deliveryId || 0, 'Delivery'),
    });
    updateDocumentId('Delivery');
    return result;
  } catch (message) {
    console.error(message);
    return undefined;
  }
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

export const removeInvoiceId = (deliveryId: string) => {
  relDb.rel
    .find('delivery', deliveryId)
    .then((result) => {
      const delivery = result.deliveries[0];
      relDb.rel.save('delivery', { ...delivery, invoiceId: undefined }).catch(console.error);
    })
    .catch(console.error);
};

export const updateDelivery = async (delivery: Delivery, input: DeliveryInput) => {
  const customer = await getCustomer(input.customerId);
  await loadFarm();
  const promise = async () => {
    const lines = await Promise.all(
      input.lines.map(async (el) => {
        const product = await loadProduct(el.productId);
        return { ...el, product: { ...product, price: +el.price || 0 } };
      }),
    );
    return {
      ...input,
      customer,
      lines: lines.filter((p) => !!p).map((l) => ({ ...l, quantity: +l.quantity })),
    };
  };

  promise()
    .then((deliveryFull) => {
      console.log({ deliveryFull, delivery });
      relDb.rel.save('delivery', { ...delivery, ...deliveryFull }).catch(console.error);
    })
    .catch(console.error);
};

export const deleteDelivery = (delivery: Delivery) => {
  return relDb.rel.del('delivery', delivery);
};
