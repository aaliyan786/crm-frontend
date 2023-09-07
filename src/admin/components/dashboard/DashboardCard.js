import React from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const InvoiceCard = ({ title, value }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      shadow="md"
      w="100%"
    >
      <Flex align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
      </Flex>
    </Box>
  );
};

export default InvoiceCard;
