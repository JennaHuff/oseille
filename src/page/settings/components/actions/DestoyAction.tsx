import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { destroyDatabase } from '../../../../backend';
import { useConfirm } from '../../../../component/modal/confirm-modal/ConfirmContext';

export function DestroyAction() {
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const destroyDb = async () => {
    if (
      await confirm({
        title: 'Tout effacer',
        message:
          "Vous allez supprimer toute la base de donnée, assurez vous d'avoir bien fait un export de vos données",
      })
    ) {
      destroyDatabase()
        .then(() => navigate('/'))
        //.then(() => window.location.reload())
        .catch(console.error);
    }
  };

  return (
    <Button
      colorScheme="red"
      onClick={destroyDb}
    >
      Armageddon
    </Button>
  );
}
