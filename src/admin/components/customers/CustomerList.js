// src\admin\components\customers\CustomerList.js
import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  useToast,
  Flex,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  TableContainer,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import {
  BiSearch,
  BiShow,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";
import CustomerDrawer from "./viewDrawer";
import EditCustomerDrawer from "./editDrawer";
import AddCustomerDrawer from "./addCustomerDrawer";
import { deleteCustomer } from "../../../API/api";
import DeleteAlert from "../../../components/common/DeleteAlert";




const CustomerList = ({ customers, onDeleteCustomer, handleFetchUpdatedCustomer }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.fname + " " + customer.lname)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.added_by_employee?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleShowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState(null);
  const handleEditClick = (customer) => {
    setSelectedEditCustomer(customer);
    setIsEditDrawerOpen(true);
  }

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteAlertOpen(true);
    setDeleteErrorMessage(""); 
  };

  const toast = useToast();
  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete.id);
        toast({
          title: "Invoice Deleted",
          description: "The invoice has been deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onDeleteCustomer(customerToDelete.id); 

        setIsDeleteAlertOpen(false);

        setCustomerToDelete(null);
        setDeleteErrorMessage("");

      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast({
            title: "Error",
            description: "You cannot delete this client",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        console.error("Error deleting customer:", error);
      } finally {
        setIsDeleteAlertOpen(false);
        setCustomerToDelete(null); 
      }
    }
  };



  const [isAddCustomerDrawerOpen, setIsAddCustomerDrawerOpen] = useState(false);
  const handleAddCustomerClick = () => {
    setIsAddCustomerDrawerOpen(true);
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
    >
      <Flex align="end" justify="flex-end" mb={4}>
        <Flex align="end" justify="center">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none" color="gray.400" fontSize="1.2em" ml={2}>
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search by full name, email or company name"
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="0.5rem"
              py={2}
              pl={10}
              pr={3}
              mr={2}
              fontSize="md"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Flex>
        <Button size={{base:"sm", md:"md"}} w={{ base: "xs", md: "auto" }} colorScheme="blue" borderRadius="0.5rem" px={8} py={3} fontSize={{base:"xs", md:"md"}} onClick={handleAddCustomerClick}>
          Add New Customer
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Company</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Added by Employee</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((customer) => (
              <Tr key={customer.id}>
                <Td>{customer.company_name}</Td>
                <Td>{customer.lname}</Td>
                <Td>{customer.fname}</Td>
                <Td>{customer.email}</Td>
                <Td>{customer.phone}</Td>
                <Td>{customer.added_by_employee}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<HiDotsVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<BiShow />} onClick={() => handleShowClick(customer)}>Show</MenuItem>
                      <MenuItem icon={<FiEdit />} onClick={() => handleEditClick(customer)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleDeleteClick(customer)} icon={<FiTrash2 />}>
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
            isDisabled={indexOfLastItem >= filteredCustomers.length}
            onClick={() => handlePageChange(currentPage + 1)}
            ml={2}
            aria-label="Next Page"
          />
        </Box>
        <Text fontSize="sm">
          Page {currentPage} of {Math.ceil(filteredCustomers.length / itemsPerPage)}
        </Text>
      </Flex>

      {/* FOR ADD CUSTOMER */}
      {isAddCustomerDrawerOpen && (
        <AddCustomerDrawer
          isOpen={isAddCustomerDrawerOpen}
          onClose={() => setIsAddCustomerDrawerOpen(false)}
          handleFetchUpdatedCustomer={handleFetchUpdatedCustomer}
        />
      )}

      {/* FOR VIEW DETAILS */}
      {isDrawerOpen && (
        <CustomerDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          customerDetails={selectedCustomer}
        />
      )}

      {/* FOR EDIT DETAILS */}
      {isEditDrawerOpen && (
        <EditCustomerDrawer
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
          customerDetails={selectedEditCustomer}
          handleFetchUpdatedCustomer={handleFetchUpdatedCustomer}
        />
      )}

      {/* Delete Alert */}
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Customer"}
        BodyText={"Are you sure you want to delete this Customer?"}
      />
    </Box>
  );
};

export default CustomerList;
