import React from "react";
import { Box, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";

const InvoiceCard = ({ title, value, textColor, backgroundColor }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const valueColor = useColorModeValue(textColor, textColor);
  // const textColor = useColorModeValue("grey.600","grey.200");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      shadow="md"
    >
      <Text fontSize="xl" fontWeight="semibold" mb={2} align='center' paddingBottom={2}>
        {title}
      </Text>
      <hr />
      <HStack align='center' justify='center'>
        <Text mt={5} fontWeight={100} fontSize='md' align='start'>This Month</Text>
        <Text
          mt={5}
          fontSize="l"
          fontWeight="bold"
          align='end'
          border="1px solid"
          borderRadius='0.3rem'
          padding="0 4px"
          bg={backgroundColor} // Apply the background color here
          color={valueColor} // Apply the text color here
        >
          {value}
        </Text>
      </HStack>
    </Box>
  );
};

export default InvoiceCard;
