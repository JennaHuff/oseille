import { usePostHog } from 'posthog-js/react';
import { useNavigate } from 'react-router-dom';
import { Invoice, deleteInvoice } from '../../../backend';
import { DeleteButton } from '../../../component/buttons';
import { useConfirm } from '../../../component/modal/confirm-modal/ConfirmContext';
import { useSideKick } from '../../../component/modules/sidekick/SideKickContext';
import { SideKickFeeling } from '../../../component/modules/sidekick/enums';
import { useFarmParameters } from '../../../utils/hooks/useFarmParameters';

interface DeleteInvoiceActionProps {
  invoice: Invoice;
}

export function InvoiceDeleteButton({ invoice }: DeleteInvoiceActionProps) {
  const { confirm } = useConfirm();
  const { say } = useSideKick();
  const { farm } = useFarmParameters();
  const posthog = usePostHog();
  const navigate = useNavigate();

  const isDeletable = farm && Number(invoice.documentId.split('-')[2]) === farm.invoiceId - 1;

  const handleDeleteInvoice = async () => {
    if (
      await confirm({
        title: 'Supprimer la facture',
        message: 'Vous ne pourrez pas la récupérer',
      })
    ) {
      posthog?.capture('invoice_delete');
      deleteInvoice(invoice).then(() =>
        say({
          sentence: `La facture ${invoice.documentId} a bien été supprimée`,
          autoShutUp: true,
          feeling: SideKickFeeling.GOOD,
        }),
      );
      navigate('..');
    }
  };

  return (
    <DeleteButton
      onClick={handleDeleteInvoice}
      disabled={!isDeletable}
    />
  );
}
