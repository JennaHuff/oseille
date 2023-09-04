import { Button, useDisclosure } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Delivery, DeliveryInput, updateDelivery } from '../../../backend';
import { EditButton } from '../../../component/buttons';
import { EditDialog } from '../../../component/modal/edit-dialog/EditDialog';
import { DeliveryFields } from '../DeliveryFields';
import { deliverySchema } from './CreateDeliveryAction';

interface EditDeliveryActionProps {
  delivery: Delivery;
}

export function EditDeliveryAction({ delivery }: EditDeliveryActionProps) {
  const isEditable = !delivery.invoiceId;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();

  const updatedValues = {
    customerId: delivery.customerId,
    deliveredAt: delivery.deliveredAt,
    lines: delivery.lines.map((line) => ({
      productId: line.product.id,
      price: line.price || line.product.price,
      quantity: line.quantity,
    })),
  };

  const { control, register, handleSubmit, reset, watch, setValue, getValues } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: updatedValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const onSubmit = (e: DeliveryInput) => updateDelivery(delivery, e).then(handleClose).catch(console.error);
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      reset();
      remove();
    }, 100);
  };

  useEffect(() => {
    reset(updatedValues);
  }, [delivery]);

  return (
    <>
      <EditButton
        onClick={onOpen}
        disabled={!isEditable}
        ml={3}
      />
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
    </>
  );
}