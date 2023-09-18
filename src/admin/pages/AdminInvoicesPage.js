import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

import {
  Box,
  Center,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import InvoiceList from "../components/invoices/InvoiceList";
import { fetchAllInvoices, getInvoiceById, getdata } from "../../API/api";

const AdminInvoicesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [invoices, setInvoices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let department = "";
  const encryptedData = localStorage.getItem("encryptedData");
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";
  if (encryptedData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      console.log("Department", decryptedData);
      if (decryptedData) {
        department = decryptedData;
      } else {
        console.error("Decryption resulted in empty data");
      }
    } catch (error) {
      console.error("Decryption error:", error);
    }
  } else {
    console.error("Item not found in local storage");
  }

  useEffect(() => {
    async function fetchInvoices() {
      setIsLoading(true);
      try {
        let response;
        if (department === "sales" || department === "accounts") {
        response = await getdata();
          console.log("admin invoices",response);
        setInvoices(response);
          console.log("Fetched invoices for admin", invoices);
        } else {
         response = await fetchAllInvoices();
          console.log("admin invoices",response);
        setInvoices(response);
          console.log("Fetched invoices for admin", invoices);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setIsLoading(false);
      }
      setIsLoading(true);
      try {
        
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInvoices();
  }, [department]);

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
    setIsLoading(true);
      try {
        let response;
        if (department === "sales" || department === "accounts") {
          response = await getdata();
          setInvoices(response.data.documents);
          console.log("ananas",invoices)
          console.log("Fetched invoices for sales/accounts", response.data.documents);
        } else if (department === 'admin') {
          const response = await fetchAllInvoices();
        setInvoices(response);
          console.log("Fetched invoices for admin", response);
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setIsLoading(false);
      }
      setIsLoading(true);
  };

  console.log("last",invoices)
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

export default AdminInvoicesPage;
