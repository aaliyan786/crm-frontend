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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FiCreditCard, FiEdit, FiFile, FiSend, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import {
  BiSearch, BiShow, BiChevronLeft,
  BiChevronRight,
  BiCreditCard
} from "react-icons/bi";

import Drawers from "../drawers";
import ShowDrawer from "../showDrawer";
import EditDrawer from "../editDrawer";
// import RecordPaymentDrawer from "./recordPaymentDrawer";
import PdfDrawer from "../pdfDrawer";
import DeleteAlert from "../../../../components/common/DeleteAlert";
import { deleteQuote } from "../../../../API/api";
import LossDrawers from "./AssignedDrawers";
import AssignedDrawers from "./AssignedDrawers";
import { WarningTwoIcon } from "@chakra-ui/icons";


const AssignedQuoteList = ({ quotes, handleAddUpdateDeleteQuote }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  console.log("quotelist", quotes);
  const statusColors = {
    "DRAFT": "blue",
    "PENDING": "yellow",
    "SENT": "green",
    "EXPIRED": "orange",
    "DECLINED": "red",
    "ACCEPTED": "teal",
    "LOST": "gray",
  };

  const paymentColors = {
    "PAID": "green",
    "PARTIALLY PAID": "yellow",
    "UNPAID": "red",

  };

  console.log("quotesssssssssssssssssssssssssss", quotes)
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuotes = quotes.filter(
    (quote) =>
      (quote.QuoteData?.number?.toLowerCase().includes(searchTerm) ||
        quote.QuoteData?.status?.toLowerCase().includes(searchTerm) ||
        (quote.QuoteData?.client_fname + " " + quote.QuoteData?.client_lname)
          .toLowerCase()
          .includes(searchTerm) ||
        (quote.QuoteData?.employee_name + " " + quote.QuoteData?.employee_surname)
          .toLowerCase()
          .includes(searchTerm)) &&
      (selectedPaymentFilter === "all" || quote.QuoteData?.payment_status === selectedPaymentFilter) &&
      (selectedStatusFilter === "all" || quote.QuoteData?.status === selectedStatusFilter)
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSendMessage = (quote) => {
    onOpen();
  };


  const toast = useToast();

  const token = localStorage.getItem('token');

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
      mx="auto"    // Center the box horizontally
    >
      <Flex align="center" justify="flex-end" mb={4}>
        <Flex align="center" >
          <InputGroup maxW="300px" size={'sm'}> {/* Limit the width of the search bar */}
            <InputLeftElement pointerEvents="none" color="gray.400" fontSize="1.2em" ml={2}>
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
          </InputGroup >
        </Flex>

      </Flex>



      <Box overflowX="auto">
        <TableContainer>
          <Table variant="simple" size={'sm'}>
            <Thead>
              <Tr>
                <Th>Quote  Number</Th>
                <Th>Client</Th>
                <Th >Date</Th>
                <Th >Due Date</Th>
                <Th >Added by Employee</Th>
                <Th>Assigned to</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Actions</Th>

              </Tr>
            </Thead>
            <Tbody>
              {currentQuotes.map((quote) => (
                <Tr key={quote.quotesData?.id}>
                  <Td>{quote.quotesData?.number}</Td>
                  <Td>{quote.quotesData?.client_fname + ' ' + quote.quotesData?.client_lname}</Td>
                  <Td>{new Date(quote.quotesData?.quote_current_date).toLocaleDateString()}</Td>
                  <Td>{new Date(quote.quotesData?.expiry_date).toLocaleDateString()}</Td>
                  <Td>{quote.quotesData?.employee_name + ' ' + quote.quotesData?.employee_surname}</Td>
                  <Td>null</Td>
                  <Td>{quote.quotesData?.total_amount}</Td>
                  {/* <Td>{quote.QuoteData?.total_amount - quote.QuoteData?.total_amount_paid}</Td> */}
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant='outline'
                      colorScheme={statusColors[quote.quotesData?.status]}
                    >
                      {quote.quotesData?.status}
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
                        <MenuItem
                          icon={<FiSend />}
                          onClick={() => handleSendMessage()}
                        >
                          Accept & Send Message
                        </MenuItem>
                        <Modal isOpen={isOpen} onClose={onClose} >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Send Message</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Textarea borderColor="gray" minH={200} maxH={350}/>
                              <HStack mt={1}>
                                <Box ml={1} color="yellow.600">
                                  <WarningTwoIcon />
                                </Box>
                                <Box >
                                  <Text fontSize="xs" color="yellow.600">Sending the message indicates that you have <strong>accepted</strong> this quote.</Text>
                                  <Text fontSize="xs" color="yellow.600" >This will also <strong>remove</strong> this quote from your Assigned Quotes.</Text>
                                </Box>
                              </HStack>

                            </ModalBody>

                            <ModalFooter>
                              <Button colorScheme='red' mr={3} onClick={onClose} variant="outline">
                                Cancel
                              </Button>
                              <Button variant='solid' colorScheme="green" >Send Message</Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>

                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              )
              )
              }
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
          Page {currentPage} of {Math.ceil(filteredQuotes.length / itemsPerPage)}
        </Text>
      </Flex>
      <AssignedDrawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedQuoteData}
        handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote}
      />


    </Box >
  );
};


export default AssignedQuoteList;