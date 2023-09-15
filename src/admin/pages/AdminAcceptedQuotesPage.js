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
import AcceptedQuoteList from "../components/quotes/AcceptedQuotes/AcceptedQuoteList";
import { getAllQuotesByAdminStatus } from "../../API/api";
import PendingQuoteList from "../components/quotes/AcceptedQuotes/PendingQuoteList";
import RejectedQuoteList from "../components/quotes/AcceptedQuotes/RejectedQuoteList";

const AdminAcceptedQuotesPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [quotesPending, setPendingQuotes] = useState([]);
  const [quotesApproved, setApprovedQuotes] = useState([]);
  const [quotesRejected, setRejectedQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const fetchQuotes = async () => {
  //   try {
  //     const quotesData = await getAllQuotes();
  //     setQuotes(quotesData);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchQuotes(); // Fetch quotes when the component mounts
  //   console.log("quotes",quotes)
  // }, []);






  const fetchAllStatusQuotes = async () => {
    setIsLoading(true)
    try {
      let response = await getAllQuotesByAdminStatus(3);
      let quotesData = response || []; // Ensure Quote is an array
      setRejectedQuotes(quotesData);
      response = await getAllQuotesByAdminStatus(1);
      quotesData = response || []; //
      setPendingQuotes(quotesData);
      response = await getAllQuotesByAdminStatus(2);
      quotesData = response || []; // Ensure Quote is an array
      console.log('3 quotesRejected',quotesRejected)
      console.log('2 quotesApproved',quotesApproved)
      console.log('1 quotesPending',quotesPending)
      setApprovedQuotes(quotesData);
      setIsLoading(false);
      console.log("quotesData", quotesData)
    } catch (error) {
      console.error("Error fetching quotes:", error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchAllStatusQuotes(); // Fetch quotes when the component mounts
  }, []);
  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Quote Approval
        </Heading>
        {isLoading ? (
          <Center justifyContent="center">
            <div class="loader">
              <div class="cover"></div>
            </div>
          </Center>
        ) : (
          <Tabs isFitted variant="soft-rounded" defaultIndex={0}>
            <TabList>
              <Tab _selected={{ backgroundColor: "yellow.200" }} _active={{ backgroundColor: "yellow.200" }}>Pending</Tab>
              <Tab _selected={{ backgroundColor: "green.200" }} _active={{ backgroundColor: "green.200" }}>Approved</Tab>
              <Tab _selected={{ backgroundColor: "red.200" }} _active={{ backgroundColor: "red.200" }}>Rejected</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>

                <PendingQuoteList
                  quotes={quotesPending}
                  handleAddUpdateDeleteQuote={fetchAllStatusQuotes}
                // ... other props
                />

              </TabPanel>
              <TabPanel>

                <AcceptedQuoteList
                  quotes={quotesApproved}
                  handleAddUpdateDeleteQuote={fetchAllStatusQuotes}
                // ... other props
                />

              </TabPanel>
              <TabPanel>

                <RejectedQuoteList
                  quotes={quotesRejected}
                  handleAddUpdateDeleteQuote={fetchAllStatusQuotes}
                // ... other props
                />

              </TabPanel>
            </TabPanels>
          </Tabs>
        )}

      </Container>
    </Box>
  );
};

export default AdminAcceptedQuotesPage;