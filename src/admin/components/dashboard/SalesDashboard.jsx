import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import InvoiceCard from "./InvoiceCard";
import { getdashboarddatasales } from "../../../API/api"; // Update the path accordingly
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";

function SalesDashboard() {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getdashboarddatasales();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching sales dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box bg={bgColor} width="auto" minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Sales Dashboard
        </Heading>
        {dashboardData ? (
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
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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

export default SalesDashboard;
