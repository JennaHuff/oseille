import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CreateModalProps {
  isOpen: boolean;
  cancelRef: React.MutableRefObject<any>;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  children?: ReactNode;
  disabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const MyModal = ({
  title,
  children,
  isOpen,
  cancelRef,
  onClose,
  onSubmit,
  disabled,
  confirmLabel,
  cancelLabel,
}: CreateModalProps) => {
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit && onSubmit();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              {title}
            </AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>{children}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
              >
                {cancelLabel ?? 'Annuler'}
              </Button>
              {onSubmit && (
                <Button
                  colorScheme="twitter"
                  type="submit"
                  ml={3}
                  disabled={disabled}
                >
                  {confirmLabel ?? 'Enregistrer'}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </form>
    </AlertDialog>
  );
};
