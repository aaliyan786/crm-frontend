import React from "react";
import { Box, Text, Progress, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

const StatusBarChart = ({ data }) => {
  const bgColor = useColorModeValue("white", "gray.700");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderRadius="md"
      shadow="md"
      my={4}
      padding="4" // Set padding to 0
      margin="0" // Set margin to 0
    >
      <Text fontSize="xl" mb={4} fontWeight="bold">
        Invoices Status
      </Text>
      {data.map((item, index) => (
        <Grid
          key={index}
          templateColumns="repeat(3, 15% 70% 15%)"
          alignItems="center"
          gap={0}
          py={2}
          margin="0" // Set margin to 0
        >
          <GridItem>
            <Text flexShrink={0} ml={1}>
              {item.title}
            </Text>
          </GridItem>
          <GridItem>
            <Progress value={parseFloat(item.value)} size="md" colorScheme="pink" />
          </GridItem>
          <GridItem>
            <Text flexShrink={0} ml={1}>
              {item.value}
            </Text>
          </GridItem>
        </Grid>
      ))}
    </Box>
  );
};

export default StatusBarChart;