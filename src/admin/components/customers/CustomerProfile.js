import React from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const CustomerProfile = ({ customer }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      shadow="md"
      width="100%"
    >
      <Heading as="h2" size="lg" mb={4}>
        Customer Profile
      </Heading>
      <Text>
        <strong>Name:</strong> {customer.name}
      </Text>
      <Text>
        <strong>Email:</strong> {customer.email}
      </Text>
      {/* Add more customer details here */}
      <Divider mt={4} />
      {/* Add additional sections or actions */}
    </Box>
  );
};

export default CustomerProfile;
