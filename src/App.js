

import Footer from "./components/footer/footer";
import SidebarWithHeader from "./components/common/SidebarWithHeader";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminCustomersPage from "./admin/pages/AdminCustomersPage";
import AdminInvoicesPage from "./admin/pages/AdminInvoicesPage";
import AdminQuotesPage from "./admin/pages/AdminQuotesPage";
// import AdminPaymentInvoicesPage from "./admin/pages/AdminPaymentInvoicesPage";
import AdminEmployeesPage from "./admin/pages/AdminEmployeesPage";
import AdminSettingsPage from "./admin/pages/AdminSettingsPage";
import theme from "./styles/theme";
import SignIn from "./components/SignIn/SignIn";

import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from 'react-router-dom';
import AdminPaymentModes from "./admin/pages/AdminPaymentModes";
import AdminLossQuotesPage from "./admin/pages/AdminLossQuotesPage";
import AdminAcceptedQuotesPage from "./admin/pages/AdminAcceptedQuotesPage";
import SalesAssignedQuotes from "./admin/pages/SalesAssignedQuotes";
<<<<<<< HEAD
import NotFoundPage from "./admin/pages/NotFoundPage";
=======
import AdminLpuPage from "./admin/pages/AdminLpuPage";
>>>>>>> 87bc93e3eb8c4d2f5e2b184e79c7ca667ff215be


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "isUserLoggedIn") {
        setIsLoggedIn(event.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const userIsLoggedIn = localStorage.getItem("isUserLoggedIn");
    setIsLoggedIn(userIsLoggedIn === "true");
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <ChakraProvider theme={theme} >

      {isLoggedIn && <SidebarWithHeader />}
      <Routes>
        {!isLoggedIn ? <Route path="/" element={<SignIn />} /> : <Route path="/" element={<AdminDashboardPage />} />}
        {/* {isLoggedIn && <Route path="/" element={<AdminDashboardPage />} />} */}
        {isLoggedIn && <Route path="/dashboard" element={<AdminDashboardPage />} />}
        {isLoggedIn && <Route path="/customers" element={<AdminCustomersPage />} />}
        {isLoggedIn && <Route path="/invoices" element={<AdminInvoicesPage />} />}
        {isLoggedIn && <Route path="/lpu" element={<AdminLpuPage />} />}
        {isLoggedIn && <Route path="/quotes" element={<AdminQuotesPage />} />}
        {isLoggedIn && <Route path="/lossquotes" element={<AdminLossQuotesPage />} />}
        {isLoggedIn && <Route path="/acceptedquotes" element={<AdminAcceptedQuotesPage />} />}
        {isLoggedIn && <Route path="/assignedquotes" element={<SalesAssignedQuotes />} />}
        {isLoggedIn && <Route path="/employees" element={<AdminEmployeesPage />} />}
        {isLoggedIn && <Route path="/settings" element={<AdminSettingsPage />} />}
        {isLoggedIn && <Route path="/settings/paymentmodes" element={<AdminPaymentModes />} />}
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      {isLoggedIn && <Footer />}

    </ChakraProvider>
  );
}

