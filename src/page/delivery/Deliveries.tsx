import { Flex } from '@chakra-ui/react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import { addDelivery, addInvoice, DeliveryInput, exportDocument, store } from '../../backend';
import { MyButton } from '../../component/form/button/MyButton';
import { MyScreenLayout } from '../../component/layout/MyScreenLayout';
import { MyCreateModal } from '../../component/modal/MyCreateModal';
import { MyH1 } from '../../component/typography/MyFont';
import { priceFormatter } from '../../utils/formatter';
import { CreateDeliveries } from './CreateDeliveries';

export function Deliveries() {
  const { deliveries } = useSnapshot(store);

  const onSubmit: SubmitHandler<DeliveryInput> = (d) => {
    addDelivery(d);
  };

  const { register, handleSubmit } = useForm<DeliveryInput>();

  return (
    <MyScreenLayout>
      <Flex
        gap={4}
        alignItems="center"
      >
        <MyH1>Livraisons</MyH1>
        <MyCreateModal
          title={'Nouvelle livraison'}
          onSubmit={handleSubmit(onSubmit)}
        >
          <CreateDeliveries register={register} />
        </MyCreateModal>
      </Flex>
      {deliveries.map((delivery: any) => {
        return (
          <Flex
            direction="column"
            p={4}
            key={delivery._id}
          >
            <Flex
              gap={4}
              alignItems="center"
            >
              <div>
                {delivery.customer.name} - {delivery.documentId}
              </div>
              {!delivery.invoiceId ? (
                <MyButton
                  onClick={() => {
                    addInvoice([delivery]);
                  }}
                  label="Facturer"
                />
              ) : null}
              <MyButton
                onClick={() => {
                  exportDocument({ payload: delivery });
                }}
                label="Export PDF"
              />
            </Flex>

            {delivery.products.map((el: any) => {
              return (
                <div key={el.product._id}>
                  {el.quantity} * {el.product.name} #{el.productId} - {priceFormatter(el.product.price)}
                </div>
              );
            })}
          </Flex>
        );
      })}
    </MyScreenLayout>
  );
}
