import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { Customer, Delivery, store } from '../../backend';
import { CatalogDetail, CatalogList, CatalogueLayout } from '../../component/catalog/Catalog';
import { ScreenLayout } from '../../component/layout/ScreenLayout';
import { priceFormatter } from '../../utils/formatter';
import { CreateDeliveries } from './CreateDeliveries';

export function Deliveries() {
  const [selected, setSelected] = useState<Delivery>();
  const snap = useSnapshot(store);

  useEffect(() => {
    const updated = store.deliveries.find((p) => p.id === selected?.id);
    if (updated) {
      setSelected(updated);
    }
  }, [snap]);

  return (
    <ScreenLayout>
      <CatalogueLayout>
        <CatalogList
          title="Mes Livraisons"
          slot={<CreateDeliveries />}
        >
          {store.customers.map((customer) => (
            <DeliveryCustomer
              customer={customer}
              setSelected={setSelected}
              key={customer.id}
            />
          ))}
        </CatalogList>
        <CatalogDetail
          show={!!selected}
          onClear={() => setSelected(undefined)}
        >
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
              <div>
                <div>{selected.documentId}</div>
                <div>{selected.customer.name}</div>
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.products.map((product) => (
                      <tr key={product.product.id}>
                        <td>{product.product.name}</td>
                        <td>
                          {product.quantity} {product.product.unit}
                        </td>
                        <td>{priceFormatter(product.product.price)}</td>
                        <td>{priceFormatter(product.product.price * product.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CatalogDetail>
      </CatalogueLayout>
    </ScreenLayout>
  );
}

function DeliveryCustomer({
  customer,
  setSelected,
}: {
  customer: Customer;
  setSelected: (value: React.SetStateAction<Delivery | undefined>) => void;
}) {
  const [toInvoice, setToInvoice] = useState<{ [key: string]: boolean }>({});

  return (
    <div>
      <div>
        {customer.name} :{Object.values(toInvoice).filter((i) => i).length}
      </div>
      <div>
        {store.deliveries
          .filter((delivery) => delivery.customerId === customer.id)
          .map((delivery: Delivery) => {
            return (
              <Flex
                gap={3}
                key={delivery.id}
              >
                <input
                  type="checkbox"
                  id={delivery.id}
                  // rome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
                  checked={toInvoice[delivery.id] || false}
                  onChange={() =>
                    setToInvoice((i) => ({
                      ...i,
                      [delivery.id]: !i[delivery.id],
                    }))
                  }
                />
                <div
                  onClick={() => setSelected((e) => (e === delivery ? undefined : delivery))}
                  onKeyDown={() => {}}
                >
                  {delivery.documentId}
                </div>
              </Flex>
            );
          })}
      </div>
    </div>
  );
}
