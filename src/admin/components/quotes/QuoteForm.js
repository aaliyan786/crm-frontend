import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const QuoteForm = ({ onSubmit }) => {
  const bgColor = useColorModeValue("white", "gray.700");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Collect form data and call onSubmit function
    // Example: onSubmit(formData);
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      shadow="md"
      width="100%"
    >
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Customer Name</FormLabel>
          <Input type="text" placeholder="Customer Name" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Quote Amount</FormLabel>
          <Input type="number" placeholder="Quote Amount" />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Additional Notes</FormLabel>
          <Textarea placeholder="Additional Notes" />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Create Quote
        </Button>
      </form>
    </Box>
  );
};

export default QuoteForm;
