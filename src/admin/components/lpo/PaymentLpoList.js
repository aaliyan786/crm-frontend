import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from "@chakra-ui/react";

const PaymentLpoList = ({ paymentInvoices }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      shadow="md"
      width="100%"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Payment Number</Th>
            <Th>Invoice Number</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paymentInvoices.map((paymentInvoice) => (
            <Tr key={paymentInvoice.id}>
              <Td>{paymentInvoice.paymentNumber}</Td>
              <Td>{paymentInvoice.invoiceNumber}</Td>
              <Td>${paymentInvoice.amount}</Td>
              <Td>{paymentInvoice.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PaymentLpoList;
