// src\pages\AdminDashboardPage.js
import React from "react";
import "../../styles/global.css"
import CryptoJS from 'crypto-js';
import {
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import AdminDashboard from '../components/dashboard/AdminDashboard'
import AccountsDashboard from '../components/dashboard/AccountsDashboard'
import SalesDashboard from '../components/dashboard/SalesDashboard'

const AdminDashboardPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const encryptedData = localStorage.getItem('encryptedData');
  const secretKey = 'sT#9yX^pQ&$mK!2wF@8zL7vA';
  const department = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);



  return (
    <Box bg={bgColor} width="auto" minH="100vh">
    <Container maxW="container.xl" marginRight="0">
      {department === "admin" && <AdminDashboard/>}
      {department === "accounts" && <AccountsDashboard />}
      {department === "sales" && <SalesDashboard />}
      {/* ... Other existing code ... */}
    </Container>
  </Box>
  );
};

export default AdminDashboardPage;