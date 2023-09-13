import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import InvoiceList from "../components/invoices/InvoiceList";
import { fetchAllInvoices, getInvoiceById } from "../../API/api";

const AdminLpuPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true);
      try {
        const invoicesData = await fetchAllInvoices();
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    }
console.log(invoices)
    fetchInvoices();
  }, []);

  const handleDeleteInvoice = (updatedInvoices) => {
    setInvoices(updatedInvoices);
  };

  const handleAddNewInvoice = async (invoiceId) => {
    try {
      const newInvoiceData = await getInvoiceById(invoiceId);
      if (newInvoiceData.success) {
        setInvoices((prevInvoices) => [...prevInvoices, newInvoiceData.Invoice]);
      }
    } catch (error) {
      // Handle the error
      console.error("Error adding new invoice:", error);
    }
  };

  const handleUpdateInvoice = async () => {
    try {
      const invoicesData = await fetchAllInvoices();
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };


  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Invoice Management
        </Heading>
        {isLoading ? ( // Display loader when isLoading is true
          <Center>
            <div class="loader">
              <div class="cover"></div>
            </div>
          </Center>
        ) : (
          <InvoiceList invoices={invoices} handleUpdateInvoice={handleUpdateInvoice} onDeleteInvoice={handleDeleteInvoice} onAddNewInvoice={handleAddNewInvoice} />
        )}
      </Container>
    </Box>
  );
};

export default AdminLpuPage;
