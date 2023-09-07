// src\admin\pages\AdminCustomersPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import CustomerList from "../components/customers/CustomerList";
import { fetchCustomers } from "../../API/api"; // Import the fetchCustomers function

const AdminCustomersPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [customers, setCustomers] = useState([]); // State to hold fetched customer data
  const [isLoading,setIsLoading]=useState(true)
  useEffect(() => {
    // Fetch customer data when the component mounts
    async function fetchCustomersData() {
      setIsLoading(true)
      try {
        const response = await fetchCustomers(); // Use the fetchCustomers function
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }finally{
        setIsLoading(false)
      }
    }

    fetchCustomersData();
  }, []); // Empty dependency array ensures this runs only once after mounting
  const handleDeleteCustomer = (customerId) => {
    // Filter out the deleted customer from the customers state
    const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
    setCustomers(updatedCustomers);
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
        {isLoading? (
           // Display CircularProgress (Spinner) while loading
           <Center>
           <div class="loader">
             <div class="cover"></div>
           </div>
         </Center>
         
        ) : (
          // Display CustomerList component when data is fetched
          <CustomerList customers={customers} handleFetchUpdatedCustomer={handleFetchUpdatedCustomer} onDeleteCustomer={handleDeleteCustomer} />
        )}
      </Container>
    </Box>
  );
};

export default AdminCustomersPage;
