import { Text, useDisclosure } from '@chakra-ui/react';
import { FarmBankModal } from '../../../../../component/modal/FarmBankModal';
import { useFarmParameters } from '../../../../../utils/hooks/useFarmParameters';
import { SettingCard } from '../../../components/SettingCard';

export function BankSettingBlock() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { farm } = useFarmParameters();

  return (
    <SettingCard
      title="Ma banque"
      onUpdate={onOpen}
    >
      <FarmBankModal
        isOpen={isOpen}
        onClose={onClose}
      />
      {farm?.rib && <Text>RIB: {farm.rib}</Text>}
      {farm?.iban && <Text>IBAN: {farm.iban}</Text>}
      {farm?.bic && <Text>BIC: {farm.bic}</Text>}
    </SettingCard>
  );
}
