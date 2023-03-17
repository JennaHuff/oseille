import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import { Customer, loadCustomer, store } from '../../backend';
import { MyScreenLayout } from '../../component/layout/MyScreenLayout';
import { MyH1 } from '../../component/typography/MyFont';
import { CreateCustomer } from './CreateCustomer';

export function Customers() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<any>();

  const { customers } = useSnapshot(store);
  const [customer, setCustomer] = useState<Customer>();

  return (
    <MyScreenLayout>
      <Flex
        gap={4}
        alignItems="center"
      >
        <MyH1>Clients</MyH1>
        <CreateCustomer />
      </Flex>

      {customers.map((customer: Customer) => (
        <div key={customer.id}>
          <Box
            ref={btnRef}
            cursor="pointer"
            onClick={() => {
              onOpen();
              loadCustomer(customer.id).then((result) => setCustomer(result.customers[0] as unknown as Customer));
            }}
          >
            {customer.name}
          </Box>
        </div>
      ))}
      {!!customer && (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Focus client</DrawerHeader>
            <DrawerBody>
              <div>{customer.name}</div>
              <div>{customer.address1}</div>
              <div>{customer.address2}</div>
              <div>
                {customer.zip} {customer.city}
              </div>
            </DrawerBody>

            <DrawerFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Retour
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </MyScreenLayout>
  );
}
