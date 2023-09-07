// src\admin\components\quotes\AcceptedQuotes\PendingQuoteList.jsx
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
  Container,
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
import {
  deleteLostQuote,
  deleteQuote,
  acceptRejectQuote,
} from "../../../../API/api";
import AcceptedDrawers from "./AcceptedDrawers";
import ConfirmationAlert from "../../../../components/common/ConfirmationAlert";
import { updateQuoteData } from "../../../../API/api";

const PendingQuoteList = ({ quotes, handleAddUpdateDeleteQuote }) => {
  console.log("----------------------", quotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [isAcceptAlertOpen, setIsAcceptAlertOpen] = useState(false);
  const [isRejectAlertOpen, setIsRejectAlertOpen] = useState(false);
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

  let filteredQuotes = [];

  try {
    filteredQuotes = quotes.quotes.filter(
      (quote) =>
        (quote.number.toLowerCase().includes(searchTerm) ||
          quote.status.toLowerCase().includes(searchTerm) ||
          (quote.client_fname + " " + quote.client_lname)
            .toLowerCase()
            .includes(searchTerm) ||
          (quote.employee_name + " " + quote.employee_surname)
            .toLowerCase()
            .includes(searchTerm)) &&
        (selectedPaymentFilter === "all" ||
          quote.payment_status === selectedPaymentFilter) &&
        (selectedStatusFilter === "all" ||
          quote.status === selectedStatusFilter)
    );
  } catch (error) {
    console.error("Error filtering quotes:", error);
    // You can add further error handling here, such as displaying an error message to the user.
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);
  console.log("currentQuotes----------", currentQuotes);
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
  const [selectedquotes, setSelectedquotes] = useState(null);
  const actionBadgeColor = {
    YES: "green",
    NO: "red",
  };
  const openDrawer = (drawerType, quotes) => {
    setSelectedDrawerType(drawerType);
    setSelectedquotes(quotes);
    console.log("selected quotes --- ", selectedquotes);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedquotes(null);
  };
  const toast = useToast();
  const handleAcceptClick = (quoteId) => {
    setSelectedQuoteId(quoteId); // Store the ID of the invoice to be deleted
    setIsAcceptAlertOpen(true); // Open the delete confirmation dialog
  };
  const handleRejectClick = (quoteId) => {
    setSelectedQuoteId(quoteId); // Store the ID of the invoice to be deleted
    setIsRejectAlertOpen(true); // Open the delete confirmation dialog
  };
 
  const handleAcceptQuote = async () => {
    try {
      await acceptRejectQuote(selectedQuoteId, true); // Call the API to accept the quote
      const updatedQuoteData = {
        status: 6,
      };
      await updateQuoteData(selectedQuoteId, updatedQuoteData);
      toast({
        title: "Quote Accepted",
        description: "The Quote has been accepted successfully.",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
     

      
      handleAddUpdateDeleteQuote();

      // Handle any necessary state updates or notifications here
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
      console.error("Error accepting quote:", error);
      // Handle the error or show an error message to the user
    }
  };

  const handleRejectQuote = async () => {
    try {
      await acceptRejectQuote(selectedQuoteId, false); // Call the API to reject the quote
      toast({
        title: "Quote Rejected",
        description: "The Quote has been rejected successfully.",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      handleAddUpdateDeleteQuote();
      // Handle any necessary state updates or notifications here
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
      console.error("Error rejecting quote:", error);
      // Handle the error or show an error message to the user
    }
  };

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
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentQuotes.map((quote) => (
                <Tr key={quote.id}>
                  <Td>{quote.number || ""}</Td>
                  <Td>{quote.client_fname + " " + quote.client_lname}</Td>
                  <Td>
                    {new Date(quote.quote_current_date).toLocaleDateString()}
                  </Td>
                  <Td>{new Date(quote.expiry_date).toLocaleDateString()}</Td>
                  <Td>{quote.employee_name + " " + quote.employee_surname}</Td>
                  <Td>{quote.total_amount}</Td>
                  {/* <Td>{quote.quotes.total_amount - quote.quotes.total_amount_paid}</Td> */}
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant="outline"
                      colorScheme={statusColors[quote?.status]}
                    >
                      {quote?.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="xs"
                      variant="solid"
                      colorScheme="green"
                      mr={2}
                      onClick={() => handleAcceptClick(quote.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="red"
                      onClick={() => handleRejectClick(quote.id)}
                    >
                      Reject
                    </Button>
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
      <AcceptedDrawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedquotes}
        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
      />
      <ConfirmationAlert
        isOpen={isAcceptAlertOpen}
        onClose={() => setIsAcceptAlertOpen(false)}
        onConfirm={handleAcceptQuote}
        HeaderText={"Accept Quote"}
        BodyText={
          "Are you sure you want to accept this quote? this will send this quote to Client"
        }
        confirmButtonColorScheme="green" // Customize button color for accepting
        confirmButtonText="Accept" // Customize the text for the confirm button
        cancelButtonText="Cancel" // Customize the text for the cancel button
      />

      <ConfirmationAlert
        isOpen={isRejectAlertOpen}
        onClose={() => setIsRejectAlertOpen(false)}
        onConfirm={handleRejectQuote}
        HeaderText={"Reject Quote"}
        BodyText={"Are you sure you want to reject this quote?"}
        confirmButtonColorScheme="red" // Customize button color for rejecting
        confirmButtonText="Reject" // Customize the text for the confirm button
        cancelButtonText="Cancel" // Customize the text for the cancel button
      />
    </Box>
  );
};

export default PendingQuoteList;
