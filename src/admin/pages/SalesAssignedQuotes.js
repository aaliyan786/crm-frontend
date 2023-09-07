import React, { useState, useEffect } from "react";
import {
    Box,
    Center,
    Container,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import QuoteList from "../components/quotes/QuoteList";
import { getAllQuotes } from "../../API/api";
import AssignedQuoteList from "../components/quotes/AssignedQuotes/AssignedQuoteList";

function SalesAssignedQuotes() {
    const bgColor = useColorModeValue("gray.100", "gray.700");
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Function to fetch quotes from the API
    const fetchQuotes = async () => {
        try {
            const response = await getAllQuotes();
            const quotesData = response.Quote || []; // Ensure Quote is an array
            setQuotes(quotesData);
            setIsLoading(false);
            console.log("daatatatatat", quotesData)
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
            const response = await getAllQuotes();
            const quotesData = response.Quote; // Ensure Quote is an array
            setQuotes(quotesData);
            setIsLoading(false);
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
                    Assigned Quotes
                </Heading>
                {isLoading ? (
                    <Center>Loading...</Center>
                ) : (
                    <AssignedQuoteList
                        quotes={quotes}
                        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
                    // ... other props
                    />
                )}
            </Container>
        </Box>
    )
}

export default SalesAssignedQuotes