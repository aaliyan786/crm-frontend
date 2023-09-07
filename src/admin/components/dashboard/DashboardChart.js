import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";

const DashboardChart = ({ data, options }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow="md"
    >
      <Line data={data} options={options} />
    </Box>
  );
};

export default DashboardChart;
