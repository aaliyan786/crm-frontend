// src\pages\AdminDashboardPage.js
import InvoiceCard from "../components/dashboard/InvoiceCard";
import StatusBarChart from "../components/dashboard/StatusGraph";
import CircularProgressCard from "../components/dashboard/CircularProgress";
import DataTable from "../components/dashboard/DataTable";
import { fetchDashboardData } from "../../API/api"; // Update the path accordingly
import React, { useState, useEffect } from "react";
import "../../styles/global.css"
import CryptoJS from 'crypto-js';
import {
  Box,
  Container,
  GridItem,
  Heading,
  SimpleGrid,
  useColorModeValue,
  CircularProgress, CircularProgressLabel, Center
} from "@chakra-ui/react";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardChart from "../components/dashboard/DashboardChart";

// Import the required chart.js modules
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

// Register the scales
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [dashboardData, setDashboardData] = useState(null);
  // const [progressValue, setProgressValue] = useState(0); // State to control progress value
  const encryptedData = localStorage.getItem('encryptedData');
  const secretKey = 'sT#9yX^pQ&$mK!2wF@8zL7vA';
  const department = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);

  console.log(department);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setTimeout(() => {
        //   setProgressValue(70); // Set the progress value after fetching data
        // }, 1000);
        const data = await fetchDashboardData();
        setDashboardData(data);
        // Simulate a loading effect with a timeout
        // setTimeout(() => {
        //   setProgressValue(100); // Set the progress value after fetching data
        // }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box bg={bgColor} width="auto" minH="100vh">
      <Container maxW="container.xl" marginRight="0">
      {department === "admin" && (<Heading as="h1" size="xl" mb={4}>
          Admin Dashboard
        </Heading>)}
        {department === "accounts" && (<Heading as="h1" size="xl" mb={4}>
          Accounts Dashboard
        </Heading>)}
        {department === "sales" && (<Heading as="h1" size="xl" mb={4}>
          Sales Dashboard
        </Heading>)}
        {
          dashboardData ? (
            <>
            {department === "sales"  && (
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  {dashboardData.invoiceData.map((data, index) => {
                    // Check if the department is not equal to 'admin' and the title is not 'revenue card'
                    if (department !== 'admin' && data.title == 'Revenue') {
                      return null; // Skip this item
                    }
                    return (
                      <InvoiceCard
                        key={index}
                        title={data.title}
                        value={data.value}
                        textColor={data.textColor}
                        backgroundColor={data.color}
                      />
                    );
                  })}
              </SimpleGrid> )}
              {department === "admin"  && (
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  {dashboardData.invoiceData.map((data, index) => {
                    // Check if the department is not equal to 'admin' and the title is not 'revenue card'
                    if (department !== 'admin' && data.title == 'Revenue') {
                      return null; // Skip this item
                    }
                    return (
                      <InvoiceCard
                        key={index}
                        title={data.title}
                        value={data.value}
                        textColor={data.textColor}
                        backgroundColor={data.color}
                      />
                    );
                  })}
              </SimpleGrid> )}

              <SimpleGrid templateColumns="3fr 1fr" spacing={4} marginTop={3}>
                  {department == "accounts" && (<StatusBarChart data={dashboardData.statusGraphData} />)}
                  {department == "admin" && (<StatusBarChart data={dashboardData.statusGraphData} />)}
                  {department === "admin" && (
                    <CircularProgressCard data={dashboardData.customerPercentage} />
                  )}
              </SimpleGrid>   


              <SimpleGrid columns={2} spacing={4}>
  {department === "admin" && (
    <>
      <DataTable
        data={dashboardData.recentInvoicesData}
        title="Recent Invoices"
        buttonLabel="View All"
        to="/invoices"
      />
      <DataTable
        data={dashboardData.recentQuotesData}
        title="Recent Quotes"
        buttonLabel="View All"
        to="/quotes"
      />
    </>
  )}
  {department === "sales" && (
    <DataTable
      data={dashboardData.recentQuotesData}
      title="Recent Quotes"
      buttonLabel="View All"
      to="/quotes"
    />
  )}
  {department === "accounts" && (
    <DataTable
      data={dashboardData.recentInvoicesData}
      title="Recent Invoices"
      buttonLabel="View All"
      to="/invoices"
    />
  )}
</SimpleGrid>

            </>
          ) :
            (
              // Display CircularProgress with dynamic value
              // <Center>
              //   <CircularProgress
              //     value={progressValue}
              //     color="blue.400"
              //     size="120px"
              //     trackColor="gray.200"
              //     thickness="12px"
              //   >
              //     <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
              //   </CircularProgress>
              // </Center>
              <Center justifyContent="center">
                <div class="loader">
                  <div class="cover"></div>
                </div>
              </Center>
            )
        }
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;