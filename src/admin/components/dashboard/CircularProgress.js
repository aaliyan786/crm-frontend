import React from "react";
import { Box, Text, CircularProgress, CircularProgressLabel, useColorModeValue, Flex } from "@chakra-ui/react";
import { FiArrowUp } from "react-icons/fi";

const CircularProgressComponent = ({ data }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="md"
      my={4}
      textAlign="center"
      padding="4"
      alignItems="center"
      justifyContent="center"
      flexDirection="column" // Align items vertically
    >
      {data && (
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={8}>
            Customer Percentage
          </Text>
          <CircularProgress value={parseInt(data.value)} size="120px">
            <CircularProgressLabel>{data.value}</CircularProgressLabel>
          </CircularProgress>
        </Box>
      )}
      <Text display="flex" alignItems="center" justifyContent="center" color="green" mt={4}>
        <FiArrowUp style={{ marginRight: '0.5rem' }} /> New Customers this Month
      </Text>
    </Flex>
  );
};

export default CircularProgressComponent;
