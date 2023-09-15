// src\pages\AdminDashboardPage.js
import InvoiceCard from "./InvoiceCard";
import StatusBarChart from "./StatusGraph";
import CircularProgressCard from "./CircularProgress";
import DataTable from "./DataTable";
import React, { useState, useEffect } from "react";
import "../../../styles/global.css"
import {
  Box,
  Container,
  GridItem,
  Heading,
  SimpleGrid,
  useColorModeValue,
  CircularProgress, CircularProgressLabel, Center
} from "@chakra-ui/react";
import DashboardCard from "./DashboardCard";
import DashboardChart from "./DashboardChart";
import { fetchDashboardData } from "../../../API/api"; // Update the path accordingly

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ...import statements...

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const bgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box bg={bgColor} width="auto" minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Admin Dashboard
        </Heading>
        {dashboardData ? ( // Check if dashboardData is not null
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {dashboardData.invoiceData.map((data, index) => (
                <InvoiceCard
                  key={index}
                  title={data.title}
                  value={data.value}
                  textColor={data.textColor}
                  backgroundColor={data.color}
                />
              ))}
              <CircularProgressCard data={dashboardData.customerPercentage} />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <DataTable
                data={dashboardData.recentInvoicesData}
                title="Recent invoices"
                buttonLabel="View All"
                to="/invoices"
              />
              <DataTable
                data={dashboardData.recentQuotesData}
                title="Recent Quotes"
                buttonLabel="View All"
                to="/quotes"
              />
            </SimpleGrid>
          </>
        ) : (
          <Center justifyContent="center">
            <div className="loader">
              <div className="cover"></div>
            </div>
          </Center>
        )}
      </Container>
    </Box>
  );
}

export default AdminDashboard;



