import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from "./components/footer/footer";
import SidebarWithHeader from "./components/common/SidebarWithHeader";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminCustomersPage from "./admin/pages/AdminCustomersPage";
import AdminInvoicesPage from "./admin/pages/AdminInvoicesPage";
import AdminQuotesPage from "./admin/pages/AdminQuotesPage";
import AdminEmployeesPage from "./admin/pages/AdminEmployeesPage";
import AdminSettingsPage from "./admin/pages/AdminSettingsPage";
import theme from "./styles/theme";
import SignIn from "./components/SignIn/SignIn";
import AdminPaymentModes from "./admin/pages/AdminPaymentModes";
import AdminLossQuotesPage from "./admin/pages/AdminLossQuotesPage";
import AdminAcceptedQuotesPage from "./admin/pages/AdminAcceptedQuotesPage";
import SalesAssignedQuotes from "./admin/pages/SalesAssignedQuotes";
import NotFoundPage from "./admin/pages/NotFoundPage";
import AdminLpoPage from "./admin/pages/AdminLpoPage";
import QuoteApproval from "./admin/components/quotes/QuoteApproval";
import TempQuote from "./admin/components/TempQuote/TempQuote";
import TempQuotesPage from "./admin/pages/TempQuotesPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

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

  // Define an array of paths where you want to show the header and footer
  const allowedPaths = [
    "/",
    "/dashboard",
    "/customers",
    "/invoices",
    "/lpo",
    "/quotes",
    // "/quoteapproval/:id",
    "/tempquote",
    "/quoteapproval/:pdfid",
    "/lossquotes",
    "/acceptedquotes",
    "/assignedquotes",
    "/employees",
    "/settings",
    "/settings/paymentmodes"
  ];

  // Check if the current route matches any of the allowed paths
  const showHeaderFooter = allowedPaths.includes(location.pathname);

  if (!isLoggedIn) {
    return (
      <ChakraProvider theme={theme}>
        <Routes>
          <Route path="/" element={<SignIn />} />
        </Routes>
      </ChakraProvider>
    );
  } else {
    return (
      <ChakraProvider theme={theme}>
        {showHeaderFooter && <SidebarWithHeader/>}
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/customers" element={<AdminCustomersPage />} />
          <Route path="/invoices" element={<AdminInvoicesPage />} />
          <Route path="/lpo" element={<AdminLpoPage />} />
          <Route path="/quotes" element={<AdminQuotesPage />} />
          <Route path="/tempquote" element={<TempQuotesPage />} />
          {/* <Route path="/quoteapproval/:id" element={<QuoteApproval />} /> */}
          <Route path="/quoteapproval/:pdfid" element={<QuoteApproval />} />
          <Route path="/lossquotes" element={<AdminLossQuotesPage />} />
          <Route path="/acceptedquotes" element={<AdminAcceptedQuotesPage />} />
          <Route path="/assignedquotes" element={<SalesAssignedQuotes />} />
          <Route path="/employees" element={<AdminEmployeesPage />} />
          <Route path="/settings" element={<AdminSettingsPage />} />
          <Route path="/settings/paymentmodes" element={<AdminPaymentModes />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {showHeaderFooter && <Footer />}
      </ChakraProvider>
    );
  }
}
