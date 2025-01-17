import { zodResolver } from '@hookform/resolvers/zod';
import { usePostHog } from 'posthog-js/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Invoice, InvoicePaymentInput, PaymentMode, store, updateInvoice } from '../../../backend';
import { MyModal } from '../../../component/modal/MyModal';
import { useSideKick } from '../../../component/modules/sidekick/SideKickContext';
import { SideKickFeeling } from '../../../component/modules/sidekick/enums';
import { getInvoiceTotal } from '../../../utils/aggregations';
import { PaymentFields } from './PaymentFields';

export const paymentSchema = z.object({
  paidAt: z.string(),
  paymentMode: z.nativeEnum(PaymentMode),
  amount: z.number().min(0),
  reference: z.string(),
  notes: z.string(),
});

export function PaymentModal() {
  const { id } = useParams();
  const invoice = id ? (store.invoices.find((el) => el.id === id) as Invoice) : undefined;
  if (!invoice) return null;

  const posthog = usePostHog();
  const cancelRef = useRef<any>();
  const { say } = useSideKick();
  const navigate = useNavigate();
  const handleClose = () => navigate('..');

  const emptyPayment = {
    paymentMode: undefined,
    paidAt: new Date().toISOString().split('T')[0],
    amount: getInvoiceTotal(invoice),
    reference: '',
    notes: '',
  };

  const { control, register, handleSubmit, reset, formState } = useForm<InvoicePaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { ...emptyPayment, ...invoice?.payments?.[0] },
  });

  const onSubmit = (payment: InvoicePaymentInput) => {
    posthog?.capture('invoice_pay');
    invoice &&
      updateInvoice({ ...invoice, payments: [payment] })
        .then(() =>
          say({
            sentence: `Le paiement pour la facture ${invoice.documentId} a bien été enregistré`,
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
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={invoice?.payments && invoice.payments.length > 0 ? "Edition d'un paiement" : "Ajout d'un paiement"}
    >
      <PaymentFields
        control={control}
        register={register}
      />
    </MyModal>
  );
}
