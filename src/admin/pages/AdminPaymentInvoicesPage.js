import React from "react";
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import PaymentInvoiceList from "../components/invoices/PaymentInvoiceList";

const paymentInvoices = [
  { id: 1, paymentNumber: "PMT-001", invoiceNumber: "INV-001", amount: 500, status: "Paid" },
  { id: 2, paymentNumber: "PMT-002", invoiceNumber: "INV-002", amount: 750, status: "Pending" },
  // Add more payment invoice data
];

const AdminPaymentInvoicesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.lg">
        <Heading as="h1" size="xl" mb={4}>
          Payment Invoice Management
        </Heading>
        <PaymentInvoiceList paymentInvoices={paymentInvoices} />
      </Container>
    </Box>
  );
};

export default AdminPaymentInvoicesPage;
