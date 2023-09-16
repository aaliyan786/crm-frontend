// src\admin\pages\AdminCustomersPage.js
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";



import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import CustomerList from "../components/customers/CustomerList";
import { fetchCustomers } from "../../API/api"; // Import the fetchCustomers function
import { fetchCustomerDataByEmployee } from "../../API/api"

const AdminCustomersPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [customers, setCustomers] = useState([]); // Initialize with an empty array
 // State to hold fetched customer data
  const [isLoading, setIsLoading] = useState(true);

  let department = ""; // Initialize the department variable
  const encryptedData = localStorage.getItem("encryptedData");
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA"; // Replace with your own secret key
  if (encryptedData) {
    try {
      // Decrypt the data
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
        console.log("Department",decryptedData)
      if (decryptedData) {
        // Data successfully decrypted, assign it to the department variable
        department = decryptedData;

      } else {
        // Handle the case where decryption resulted in empty data
        console.error("Decryption resulted in empty data");
      }
    } catch (error) {
      // Handle decryption errors
      console.error("Decryption error:", error);
    }
  } else {
    // Handle the case where 'encryptedData' is not found in local storage
    console.error("Item not found in local storage");
  }
  useEffect(() => {

    if (department === "sales" || department === "accounts") {
      async function fetchCustomersDataByEmployee() {
        setIsLoading(true);
        try {
          const response = await fetchCustomerDataByEmployee(); // Replace with the correct function name
          setCustomers(response);
          console.log("i like to party",response)
        } catch (error) {
          console.error("Error fetching customer data by employee:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchCustomersDataByEmployee();

    } else {
      async function fetchCustomersData() {
        setIsLoading(true);
        try {
          const response = await fetchCustomers(); // Use the fetchCustomers function
          setCustomers(response.data);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchCustomersData();
    }
  }, [department]);


  const handleDeleteCustomer = (customerId) => {
    if (customers) {
      // Check if the customers array exists
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== customerId
      );
      setCustomers(updatedCustomers);
    }
  };
  const handleFetchUpdatedCustomer = async () => {
    try {
      const response = await fetchCustomers(); // Use the fetchCustomers function
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Customer Management
        </Heading>
        {isLoading ? (
          // Display CircularProgress (Spinner) while loading
          <Center>
            <div class="loader">
              <div class="cover"></div>
            </div>
          </Center>
        ) : (
          // Display CustomerList component when data is fetched
          <CustomerList
            customers={customers}
            handleFetchUpdatedCustomer={handleFetchUpdatedCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}
      </Container>
    </Box>
  );
};

export default AdminCustomersPage;
