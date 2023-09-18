import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

import {
  Box,
  Center,
  Container,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import QuoteList from "../components/quotes/QuoteList";
import { getAllQuotes,getAllQuotesByEmployee } from "../../API/api";


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

const AdminQuotesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let quotesData;
  // Function to fetch quotes from the API
  const fetchQuotes = async () => {
    try {
      let response;
      if (department === "sales" || department === "accounts") {
        response = await getAllQuotesByEmployee();
        console.log('s/a',response);
        quotesData = response.Quote || [];
        setQuotes(quotesData);
        } else {
         response = await getAllQuotes();
        console.log('admin',response);
        quotesData = response.Quote || [];
          setQuotes(quotesData);
        }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(); // Fetch quotes when the component mounts
  }, []);

  const handleAddUpdateDeleteQuote = async () => {
    try {
      let response;
      if (department === "sales" || department === "accounts") {
        response = await getAllQuotesByEmployee();
        quotesData = response.Quote || [];
        setQuotes(quotesData);
        } else {
         response = await getAllQuotes();
        quotesData = response.Quote || [];
          setQuotes(quotesData);
        }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setIsLoading(false);
    }
  }
  // Rest of your component code...

  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Quote Management
        </Heading>
        {isLoading ? (
          <Center justifyContent="center">
          <div class="loader">
            <div class="cover"></div>
          </div>
        </Center>
        ) : (
          <QuoteList
            quotes={quotes}
            handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
          // ... other props
          />
        )}
      </Container>
    </Box>
  );
};

export default AdminQuotesPage;