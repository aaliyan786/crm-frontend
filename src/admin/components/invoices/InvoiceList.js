// src\components\invoices\InvoiceList.js
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
import { FiEdit, FiFile, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import {
  BiSearch, BiShow, BiChevronLeft,
  BiChevronRight,
  BiCreditCard
} from "react-icons/bi";

import Drawers from "./drawers";
// import ShowDrawer from "./showDrawer";
// import EditDrawer from "./editDrawer";
// import RecordPaymentDrawer from "./recordPaymentDrawer";
// import PdfDrawer from "./pdfDrawer";
import DeleteAlert from "../../../components/common/DeleteAlert";
import { deleteInvoice } from "../../../API/api";


const InvoiceList = ({ invoices, onDeleteInvoice, onAddNewInvoice, handleUpdateInvoice }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  console.log('invoices:', invoices)
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
  const typeColors = {
    "TAX INVOICE": "green",
    "PERFORMA INVOICE": "blue",
  };

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.InvoiceData.number?.toLowerCase().includes(searchTerm) ||
        invoice.InvoiceData.status?.toLowerCase().includes(searchTerm) ||
        (invoice.InvoiceData.client_fname + " " + invoice.InvoiceData.client_lname)
          .toLowerCase()
          .includes(searchTerm) ||
        (invoice.InvoiceData.employee_name + " " + invoice.InvoiceData.employee_surname)
          .toLowerCase()
          .includes(searchTerm)) &&
      (selectedPaymentFilter === "all" || invoice.InvoiceData.payment_status === selectedPaymentFilter) &&
      (selectedStatusFilter === "all" || invoice.InvoiceData.status === selectedStatusFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

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
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);

  const openDrawer = (drawerType, invoiceData) => {
    setSelectedDrawerType(drawerType);
    setSelectedInvoiceData(invoiceData);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedInvoiceData(null);
  };
  const toast = useToast();


  const handleDeleteClick = (invoiceId) => {
    setSelectedInvoiceId(invoiceId); // Store the ID of the invoice to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInvoice(selectedInvoiceId);
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully.",
        status: "success",
        position:'top-right',
        duration: 3000,
        isClosable: true,
      });

      // Remove the deleted invoice from the list
      const updatedInvoices = invoices.filter((invoice) => invoice.InvoiceData.id !== selectedInvoiceId);
      onDeleteInvoice(updatedInvoices); // Call the prop function to update the parent's state
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
        position:'top-right',
        duration: 3000,
          isClosable: true,
        });
      }
      console.error("Error deleting invoice:", error);
    } finally {
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
      setSelectedInvoiceId(null); // Reset the selected invoice ID
    }
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
        <Box mx={2}>
          <Select size={'sm'}
            value={selectedStatusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            borderRadius="full"
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
            <option value="EXPIRED">Expired</option>
            <option value="DECLINED">Declined</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="LOST">Lost</option>
          </Select>

        </Box>
        <Box mx={2} >
          <Select size={'sm'}
            value={selectedPaymentFilter}
            onChange={(e) => handlePaymentFilterChange(e.target.value)}
            borderRadius="full"
          >
            <option value="all">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY PAID">Partially Paid</option>

          </Select>
        </Box>
        <Button colorScheme="blue" borderRadius="0.3rem" px={8} py={3} fontSize="md" onClick={() =>
          openDrawer("addNew")} size={'sm'}>
          Add New Invoice
        </Button>
      </Flex>



      <Box overflowX="auto">
        <TableContainer>
          <Table variant="simple" size={'sm'}>
            <Thead>
              <Tr>
                <Th>Invoice  Number</Th>
                <Th>Client</Th>
                <Th >Date</Th>
                <Th >Due Date</Th>
                {department == "admin" ? (<Th >Added by</Th>) : null}
                <Th>Total</Th>
                <Th>Balance</Th>
                <Th>Status</Th>
                <Th>Type</Th>
                <Th>Payment</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentInvoices.map((invoice) => (
                <Tr key={invoice.InvoiceData.id}>
                  <Td>{invoice.InvoiceData.number}</Td>
                  <Td>{invoice.InvoiceData.client_fname + ' ' + invoice.InvoiceData.client_lname}</Td>
                  <Td>{new Date(invoice.InvoiceData.invoice_current_date).toISOString().split("T")[0]}</Td>
                  <Td>{new Date(invoice.InvoiceData.expiry_date).toISOString().split("T")[0]}</Td>

                  {department == "admin" ? (<Td>{invoice.InvoiceData.employee_name + ' ' + invoice.InvoiceData.employee_surname}</Td>) : null}
                  <Td>{invoice.InvoiceData.total_amount}</Td>
                  <Td>{invoice.InvoiceData.total_amount - invoice.InvoiceData.total_amount_paid}</Td>
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant='outline'
                      colorScheme={statusColors[invoice.InvoiceData.status]}
                    >
                      {invoice.InvoiceData.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant='outline'
                      colorScheme={typeColors[invoice.InvoiceData.isPerforma]}
                    >
                      {invoice.InvoiceData.isPerforma}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      variant='solid'
                      colorScheme={paymentColors[invoice.InvoiceData.payment_status]}
                    >
                      {invoice.InvoiceData.payment_status}
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
                          onClick={() => openDrawer("show", invoice)}
                        >
                          Show
                        </MenuItem>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => openDrawer("edit", invoice)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<BiCreditCard />}
                          onClick={() => openDrawer("recordPayment", invoice)}
                        >
                          Record Payment
                        </MenuItem>
                        <MenuItem
                          icon={<FiFile />}
                          onClick={() => openDrawer("pdf", invoice)}
                        >
                          Download PDF
                        </MenuItem>
                        <MenuItem
                          // onClick={() => handleDeleteClick(customer)}
                          icon={<FiTrash2 />}
                          onClick={() => handleDeleteClick(invoice.InvoiceData.id)}
                        >
                          Delete
                        </MenuItem>
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
            isDisabled={indexOfLastItem >= filteredInvoices.length}
            onClick={() => handlePageChange(currentPage + 1)}
            ml={2}
            aria-label="Next Page"
          />
        </Box>
        <Text fontSize="smaller">
          Page {currentPage} of {Math.ceil(filteredInvoices.length / itemsPerPage)}
        </Text>
      </Flex>
      <Drawers
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedInvoiceData}
        onAddNewInvoice={onAddNewInvoice}
        handleUpdateInvoice={handleUpdateInvoice}
      />
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Invoice"}
        BodyText={"Are you sure you want to delete this invoice?"}
      />

    </Box >
  );
};


export default InvoiceList;