// import React, { useEffect, useRef } from "react";
// import { Box, Text, useColorModeValue } from "@chakra-ui/react";
// // Replace these imports in HorizontalBarChart.js
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'react-chartjs-2';

// // Register the required scales and elements
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



// const HorizontalBarChart = ({ data, title }) => {
//   const bgColor = useColorModeValue("white", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   const chartData = {
//     labels: data.map((item) => item.label),
//     datasets: [
//       {
//         data: data.map((item) => item.value),
//         backgroundColor: "rgba(0, 123, 255, 0.6)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     scales: {
//       x: {
//         beginAtZero: true,
//       },
//     },
//   };

//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.destroy();
//     }

//     const ctx = document.getElementById("horizontalBarChart").getContext("2d");
//     chartRef.current = new ChartJS(ctx, {
//       type: "bar",
//       data: chartData,
//       options: chartOptions,
//     });
//   }, [chartData, chartOptions]);

//   return (
//     <Box
//       bg={bgColor}
//       borderWidth="1px"
//       borderColor={borderColor}
//       borderRadius="lg"
//       p={4}
//       shadow="md"
//       my={4}
//     >
//       <Text fontSize="xl" fontWeight="semibold" mb={2}>
//         {title}
//       </Text>
//       <canvas id="horizontalBarChart" width={400} height={200} />
//     </Box>
//   );
// };

// export default HorizontalBarChart;
