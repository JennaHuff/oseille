import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Delivery, DeliveryInput, exportDocument, store, updateDelivery } from '../../backend';
import { DeliveryDescriptionLine } from '../../component/shared/Delivery';
import { DeliveryDescription } from '../../component/table/DeliveryDescription';
import { MyH1 } from '../../component/typography/MyFont';
import { deliverySchema } from './Deliveries';
import { DeliveryFields } from './DeliveryFields';
import { useEffect, useRef } from 'react';
import { EditDialog } from '../../component/modal/edit-dialog/EditDialog';

export const DeliveryDetail = ({ selected }: { selected: Delivery }) => {
  const isEditable = !selected.invoiceId;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updatedValues = {
    customerId: selected.customerId,
    deliveredAt: selected.deliveredAt,
    lines: selected.lines.map((line) => ({
      productId: line.product.id,
      price: line.price || line.product.price,
      quantity: line.quantity,
    })),
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      reset();
      remove();
    }, 100);
  };

  useEffect(() => {
    reset(updatedValues);
  }, [selected]);

  const { control, register, handleSubmit, reset, watch, setValue, getValues } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: updatedValues,
  });

  const cancelRef = useRef<any>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const onSubmit = (e: DeliveryInput) => updateDelivery(selected, e).then(handleClose).catch(console.error);

  return (
    <>
      <div className="catalog-header">
        <MyH1>Détail</MyH1>
        <Box>
          <Button
            disabled={!isEditable}
            colorScheme="red"
            onClick={onOpen}
          >
            Modifier
          </Button>
          <EditDialog
            isOpen={isOpen}
            cancelRef={cancelRef}
            title="Modifier la livraison"
            onClose={handleClose}
            onSubmit={handleSubmit(onSubmit)}
            fields={
              <DeliveryFields
                control={control}
                register={register}
                fields={fields}
                append={append}
                remove={remove}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
              />
            }
            footer={
              <>
                <Button
                  ref={cancelRef}
                  onClick={handleClose}
                >
                  Annuler
                </Button>
                <Button
                  colorScheme="twitter"
                  type="submit"
                  ml={3}
                >
                  Enregistrer
                </Button>
              </>
            }
          />
          <Button
            colorScheme="twitter"
            onClick={() => exportDocument({ payload: selected, type: 'Delivery' })}
            ml={3}
          >
            Exporter
          </Button>
        </Box>
      </div>

      <div>
        <DeliveryDescriptionLine delivery={selected} />
        {!!selected.invoiceId && (
          <div>{store.invoices.find((invoice) => invoice.id === selected.invoiceId)?.documentId}</div>
        )}
        <DeliveryDescription delivery={selected} />
      </div>
    </>
  );
};
