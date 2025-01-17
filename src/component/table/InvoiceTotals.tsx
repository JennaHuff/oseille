import { Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react';
import { Invoice } from '../../backend';
import { computeTaxes, getIsTVA } from '../../utils/aggregations';
import { priceFormatter } from '../../utils/formatter';

export function InvoiceTotals({ invoice }: { invoice: Invoice }) {
  const isTVA = getIsTVA(invoice);
  const taxes = computeTaxes(invoice);

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Total{isTVA && ' HT'}</Td>
            <Td
              isNumeric
              fontWeight="bold"
            >
              {priceFormatter(taxes.total.ht)}
            </Td>
            {isTVA && (
              <>
                <Td>Total TVA</Td>
                <Td
                  isNumeric
                  fontWeight="bold"
                >
                  {priceFormatter(taxes.total.tax)}
                </Td>

                <Td>Total TTC</Td>
                <Td
                  isNumeric
                  fontWeight="bold"
                >
                  {priceFormatter(taxes.total.ttc)}
                </Td>
              </>
            )}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
