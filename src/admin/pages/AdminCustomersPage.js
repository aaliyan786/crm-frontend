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
import { fetchCustomers } from "../../API/api";
import { fetchCustomerDataByEmployee } from "../../API/api";

const AdminCustomersPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let department = "";
  const encryptedData = localStorage.getItem("encryptedData");
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";

  useEffect(() => {
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

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (department === "sales" || department === "accounts") {
          response = await fetchCustomerDataByEmployee();
          setCustomers(response.data);
          console.log("Fetched customers for sales/accounts", customers);
        } else {
          response = await fetchCustomers();
          setCustomers(response.data);
          console.log("Fetched customers for admin", customers);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [department]);

  const handleDeleteCustomer = (customerId) => {
    if (customers) {
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== customerId
      );
      setCustomers(updatedCustomers);
    }
  };

  const handleFetchUpdatedCustomer = async () => {
    setIsLoading(true);
    try {
      let response;
      if (department === "sales" || department === "accounts") {
        response = await fetchCustomerDataByEmployee();
        setCustomers(response);
      } else {
        response = await fetchCustomers();
        setCustomers(response);
      }
      console.log("Fetched customers", response);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Customer Management
        </Heading>
        {isLoading ? (
          <Center>
            <div className="loader">
              <div className="cover"></div>
            </div>
          </Center>
        ) : (
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
