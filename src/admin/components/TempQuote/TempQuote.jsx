import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

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

import Drawers from "../quotes/drawers";
import ShowDrawer from "../quotes/showDrawer";
import EditDrawer from "../quotes/editDrawer";
// import RecordPaymentDrawer from "./recordPaymentDrawer";
import { LuUserPlus } from "react-icons/lu";
import PdfDrawer from "../quotes/pdfDrawer";
import DeleteAlert from "../../../components/common/DeleteAlert";
import { deleteQuote } from "../../../API/api";
import TempDrawers from "./TempDrawers";
import TempAssignDrawer from "./TempAssignModal";
import TempAssignModal from "./TempAssignModal";

const TempQuote = ({ quotes, handleAddUpdateDeleteQuote }) => {
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
    DECLINE: "red",
    ACCEPTED: "teal",
    LOST: "gray",
  };

  console.log("quotesssssssssssssssssssssssssss", quotes);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuotes = (quotes || []).filter(
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

    setSelectedStatusFilter("all"); // Reset status filter
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedQuoteData, setSelectedQuoteData] = useState(null);

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

  const token = localStorage.getItem("token");

  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);
  const openAssignDrawer = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setIsAssignDrawerOpen(true);
  };

  const closeAssignDrawer = () => {
    setIsAssignDrawerOpen(false);
  };
  let department = ""; // Initialize the department variable
  const encryptedData = localStorage.getItem("encryptedData");
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA"; // Replace with your own secret key
  if (encryptedData) {
    try {
      // Decrypt the data
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        secretKey
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedData) {
        // Data successfully decrypted, assign it to the department variable
        department = decryptedData;
      } else {
        // Handle the case where decryption resulted in empty data
        console.error("Decryption resulted in empty data");
      }
    } catch (error) {
      // Handle decryption errors
      console.error("Decryption error:", error);
    }
  } else {
    // Handle the case where 'encryptedData' is not found in local storage
    console.error("Item not found in local storage");
  }
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
                {department == "admin" ? <Th>Added by</Th> : null}
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentQuotes.map((quote) => (
                <Tr key={quote.quotesData?.id}>
                  <Td>{quote.quotesData?.number}</Td>
                  <Td>
                    {quote.quotesData?.client_fname +
                      " " +
                      quote.quotesData?.client_lname}
                  </Td>
                  <Td>
                    {new Date(
                      quote.quotesData?.quote_current_date
                    ).toLocaleDateString()}
                  </Td>
                  <Td>
                    {new Date(
                      quote.quotesData?.expiry_date
                    ).toLocaleDateString()}
                  </Td>
                  {department == "admin" ? (
                    <Td>
                      {quote.quotesData?.employee_name +
                        " " +
                        quote.quotesData?.employee_surname}
                    </Td>
                  ) : null}
                  <Td>{quote.quotesData?.total_amount}</Td>
                  {/* <Td>{quote.QuoteData?.total_amount - quote.QuoteData?.total_amount_paid}</Td> */}
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant="outline"
                      colorScheme={statusColors[quote.quotesData?.status]}
                    >
                      {quote.quotesData?.status}
                    </Badge>
                  </Td>
                  <Td>
                    {/* <Button size="xs" variant="solid" colorScheme="green" mr={2}>Accept & Send</Button>
                    <Button size="xs" variant="outline" colorScheme="red">Reject</Button> */}
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
                        <MenuItem
                          icon={<LuUserPlus />}
                          onClick={() => openAssignDrawer(quote.quotesData.id)}
                        >
                          Assign To Employee
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
      <TempDrawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedQuoteData}
        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
      />

      <TempAssignModal
        isOpen={isAssignDrawerOpen}
        onClose={closeAssignDrawer}
        quoteId={selectedQuoteId}
        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
      />
    </Box>
  );
};

export default TempQuote;
