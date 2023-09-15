import React, { useState, useEffect } from "react";
import InvoiceCard from "./InvoiceCard";
import DataTable from "./DataTable";

import { getdashboarddataaccounts } from "../../../API/api"; // Update the path accordingly
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";

function AccountsDashboard() {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getdashboarddataaccounts();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching accounts dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box bg={bgColor} width="auto" minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Accounts Dashboard
        </Heading>
        {dashboardData ? (
              <DataTable
                data={dashboardData.recentInvoicesData}
                title="Recent invoices"
                buttonLabel="View All"
                to="/invoices"
              />
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

export default AccountsDashboard;
