import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Invoice, InvoiceInfoInput, store, updateInvoice } from '../../../backend';
import { MyModal } from '../../../component/modal/MyModal';
import { useSideKick } from '../../../component/modules/sidekick/SideKickContext';
import { SideKickFeeling } from '../../../component/modules/sidekick/enums';
import { invoiceSchema } from './InvoiceCreateModal';
import { InvoiceFields } from './InvoiceFields';

interface InvoiceEditModalProps {
  invoice: Invoice;
}

export function InvoiceEditModal() {
  const { id } = useParams();
  const invoice = id ? (store.invoices.find((el) => el.id === id) as Invoice) : undefined;
  if (!invoice) return null;

  const navigate = useNavigate();
  const { say } = useSideKick();
  const cancelRef = useRef<any>();

  const { control, register, handleSubmit, reset, formState } = useForm<InvoiceInfoInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { notes: invoice.notes || '', createdAt: invoice.createdAt, isPaid: invoice.isPaid || false },
  });

  const handleClose = () => navigate(`/invoice/${id}`);

  useEffect(() => {
    reset({ notes: invoice.notes || '', createdAt: invoice.createdAt, isPaid: invoice.isPaid || false });
  }, [invoice]);

  const onSubmit = (e: InvoiceInfoInput) => {
    updateInvoice({ ...invoice, ...e })
      .then(() =>
        say({
          sentence: `La facture ${invoice.documentId} a bien été enregistrée`,
          autoShutUp: true,
          feeling: SideKickFeeling.GOOD,
        }),
      )
      .then(handleClose);
  };

  return (
    <MyModal
      isOpen={true}
      cancelRef={cancelRef}
      title="Modifier la livraison"
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      disabled={!formState.isDirty}
    >
      <InvoiceFields
        control={control}
        register={register}
      />
    </MyModal>
  );
}