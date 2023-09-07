import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import QuoteList from "../components/quotes/QuoteList";
import { getAllLostQuotes, getAllQuotes } from "../../API/api";
import LossQuoteList from "../components/quotes/LossQuotes/LossQuoteList";

const AdminLossQuotesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch quotes from the API
  const fetchQuotes = async () => {
    try {
      const quotesData = await getAllLostQuotes();
      setQuotes(quotesData);
      setIsLoading(false);
      console.log('lossssssssssssss', quotesData)
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(); // Fetch quotes when the component mounts
  }, []);


  // Rest of your component code...

  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Lost Quotes Management
        </Heading>
        {isLoading ? (
          <Center justifyContent="center">
            <div class="loader">
              <div class="cover"></div>
            </div>
          </Center>
        ) : (

          <LossQuoteList
            quotes={quotes}
            handleAddUpdateDeleteQuote={fetchQuotes}
          // ... other props
          />

        )}
      </Container>
    </Box>
  );
};

export default AdminLossQuotesPage;