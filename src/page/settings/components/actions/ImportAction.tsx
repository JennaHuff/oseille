import { Button, Input, Text, useDisclosure } from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';
import { BasicModal } from '../../../../component/modal/BasicModal';
import { handleImport } from '../../../../backend';
import { useNavigate } from 'react-router-dom';

export function ImportAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();
  const cancelRef = useRef<any>();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    handleImport({ file })
      .then((data) => {
        onClose();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Button
        colorScheme="yellow"
        onClick={onOpen}
      >
        Import
      </Button>
      <BasicModal
        title="Importer le fichier"
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <>
            <Button
              ref={cancelRef}
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              colorScheme="twitter"
              onClick={handleUploadClick}
              ml={3}
              disabled={!file}
            >
              Importer
            </Button>
          </>
        }
        cancelRef={cancelRef}
      >
        <Text>Veuillez sélectionner le fichier que vous avez reçu pendant l'export pour remplacer vos données</Text>
        <Input
          type="file"
          onChange={handleFileChange}
        />
      </BasicModal>
    </>
  );
}
