// src\components\Quote\InvoiceList.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  Flex,
  Text,
  useColorModeValue,
  Button,
  InputGroup,
  InputLeftElement,
  Center,
  Badge,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { FiCreditCard, FiEdit, FiFile, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import {
  BiSearch,
  BiShow,
  BiChevronLeft,
  BiChevronRight,
  BiCreditCard,
} from "react-icons/bi";

import Drawers from ".././drawers";
import ShowDrawer from ".././showDrawer";
import EditDrawer from ".././editDrawer";
// import RecordPaymentDrawer from "./recordPaymentDrawer";
import PdfDrawer from ".././pdfDrawer";
import DeleteAlert from "../../../../components/common/DeleteAlert";
import { deleteLostQuote, deleteQuote } from "../../../../API/api";
import LossDrawers from "./LossDrawers";

const QuoteList = ({ quotes, handleAddUpdateDeleteQuote }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  console.log("quotelist", quotes);
  const statusColors = {
    DRAFT: "blue",
    PENDING: "yellow",
    SENT: "green",
    EXPIRED: "orange",
    DECLINED: "red",
    ACCEPTED: "teal",
    LOST: "gray",
  };

  const paymentColors = {
    PAID: "green",
    "PARTIALLY PAID": "yellow",
    UNPAID: "red",
  };

  console.log("quotesssssssssssssssssssssssssss", quotes);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuotes = quotes.filter(
    (quote) =>
      (quote.QuoteData?.number?.toLowerCase().includes(searchTerm) ||
        quote.QuoteData?.status?.toLowerCase().includes(searchTerm) ||
        (quote.QuoteData?.client_fname + " " + quote.QuoteData?.client_lname)
          .toLowerCase()
          .includes(searchTerm) ||
        (
          quote.QuoteData?.employee_name +
          " " +
          quote.QuoteData?.employee_surname
        )
          .toLowerCase()
          .includes(searchTerm)) &&
      (selectedPaymentFilter === "all" ||
        quote.QuoteData?.payment_status === selectedPaymentFilter) &&
      (selectedStatusFilter === "all" ||
        quote.QuoteData?.status === selectedStatusFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();

    setSearchTerm(searchText);

    setSelectedPaymentFilter("all"); // Reset payment filter
    setSelectedStatusFilter("all"); // Reset status filter
  };

  const handlePaymentFilterChange = (value) => {
    setSelectedPaymentFilter(value);
  };

  const handleStatusFilterChange = (value) => {
    setSelectedStatusFilter(value);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedQuoteData, setSelectedQuoteData] = useState(null);
  const actionBadgeColor = {
    YES: "green",
    NO: "red",
  };
  const openDrawer = (drawerType, QuoteData) => {
    setSelectedDrawerType(drawerType);
    setSelectedQuoteData(QuoteData);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedQuoteData(null);
  };
  const toast = useToast();

  const handleDeleteClick = (quoteId) => {
    console.log("ID delete", quoteId);
    setSelectedQuoteId(quoteId); // Store the ID of the invoice to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };
  const handleConfirmDelete = async () => {
    console.log("selectedQuoteId------------", selectedQuoteId);
    try {
      await deleteLostQuote(selectedQuoteId);
      toast({
        title: "Quote Deleted",
        description: "The Quote has been deleted successfully.",
        status: "success",
          position: "top-right",
          duration: 3000,
        isClosable: true,
      });

      handleAddUpdateDeleteQuote();
      handleAddUpdateDeleteQuote(); // Call the prop function to update the parent's state
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      }
      console.error("Error deleting Quote:", error);
    } finally {
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
      setSelectedQuoteId(null); // Reset the selected Quote ID
    }
  };

  // const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  // const [customerToDelete, setCustomerToDelete] = useState(null);
  // const handleDeleteClick = (customer) => {
  //   setCustomerToDelete(customer);
  //   setIsDeleteAlertOpen(true);
  // };
  // const handleConfirmDelete = async () => {
  //   if (customerToDelete) {
  //     try {
  //       // Call API to delete customer
  //       await deleteCustomer(customerToDelete.id);
  //       onDeleteCustomer(customerToDelete.id); // Update the local state or fetch updated customer list
  //       setIsDeleteAlertOpen(false);
  //       setCustomerToDelete(null);
  //     } catch (error) {
  //       console.error("Error deleting customer:", error);
  //     }
  //   }
  // };
  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      shadow="md"
      width="100%"
      maxW="1500px" // Adjust this value to control the width
      mx="auto" // Center the box horizontally
    >
      <Flex align="center" justify="flex-end" mb={4}>
        <Flex align="center">
          <InputGroup maxW="300px" size={"sm"}>
            {" "}
            {/* Limit the width of the search bar */}
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize="1.2em"
              ml={2}
            >
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="0.3rem"
              py={2}
              pl={10}
              pr={3}
              fontSize="md"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Flex>
      </Flex>

      <Box overflowX="auto">
        <TableContainer>
          <Table variant="simple" size={"sm"}>
            <Thead>
              <Tr>
                <Th>Quote Number</Th>
                <Th>Client</Th>
                <Th>Date</Th>
                <Th>Due Date</Th>
                <Th>Added by Employee</Th>
                <Th>Assigned to</Th>
                <Th>Total</Th>
                <Th>Employee Action</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentQuotes.map((quote) => (
                <Tr key={quote.id}>
                  <Td>{quote.quoteDetails.number}</Td>
                  <Td>
                    {quote.quoteDetails?.client_fname +
                      " " +
                      quote.quoteDetails?.client_lname}
                  </Td>
                  <Td>
                    {new Date(
                      quote.quoteDetails?.quote_current_date
                    ).toLocaleDateString()}
                  </Td>
                  <Td>
                    {new Date(
                      quote.quoteDetails?.expiry_date
                    ).toLocaleDateString()}
                  </Td>
                  <Td>
                    {quote.quoteDetails?.employee_name +
                      " " +
                      quote.quoteDetails?.employee_surname}
                  </Td>
                  <Td>{quote.assigned_to_employee}</Td>
                  <Td>{quote.quoteDetails?.total_amount}</Td>
                  {/* <Td>{quote.QuoteData?.total_amount - quote.QuoteData?.total_amount_paid}</Td> */}
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant="outline"
                      colorScheme={
                        actionBadgeColor[quote.isDone === 0 ? "NO" : "YES"]
                      }
                    >
                      {quote.isDone === 0 ? "NO" : "YES"}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<HiDotsVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<BiShow />}
                          onClick={() => openDrawer("show", quote)}
                        >
                          Show
                        </MenuItem>
                        {/* <MenuItem
                          icon={<FiEdit />}
                          onClick={() => openDrawer("edit", quote)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<BiCreditCard />}
                          onClick={() => openDrawer("recordPayment", quote)}
                        >
                          Record Payment
                        </MenuItem>
                        <MenuItem
                          icon={<FiFile />}
                          onClick={() => openDrawer("pdf", quote)}
                        >
                          Download PDF
                        </MenuItem> */}
                        <MenuItem
                          // onClick={() => handleDeleteClick(customer)}
                          icon={<FiTrash2 />}
                          onClick={() => handleDeleteClick(quote.id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Flex justify="space-between" mt={4} align="center">
        <Box>
          <IconButton
            icon={<BiChevronLeft />}
            isDisabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous Page"
          />
          <IconButton
            icon={<BiChevronRight />}
            isDisabled={indexOfLastItem >= filteredQuotes.length}
            onClick={() => handlePageChange(currentPage + 1)}
            ml={2}
            aria-label="Next Page"
          />
        </Box>
        <Text fontSize="smaller">
          Page {currentPage} of{" "}
          {Math.ceil(filteredQuotes.length / itemsPerPage)}
        </Text>
      </Flex>
      <LossDrawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedQuoteData}
        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
      />
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Quote"}
        BodyText={"Are you sure you want to delete this Quote?"}
      />
    </Box>
  );
};

export default QuoteList;
