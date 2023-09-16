// src\admin\components\employees\EmployeeList.js
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
  useColorModeValue,
  TableContainer,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  useToast,
  IconButton,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { EmailIcon } from "@chakra-ui/icons";
import DrawersE from "./drawersE";
import { HiDotsVertical } from "react-icons/hi";
import { BiSearch, BiShow } from "react-icons/bi";
import { deleteEmployee } from "../../../API/api";
import DeleteAlert from "../../../components/common/DeleteAlert";


const EmployeeList = ({ employees, handleAddOrUpdateEmployee }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  console.log(employees)

  const openDrawer = (drawerType, employeeDetails) => {
    setSelectedDrawerType(drawerType);
    setSelectedEmployeeData(employeeDetails);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedEmployeeData(null);
  };
  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.surname} ${employee.email} ${employee.department}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployeeId(employeeId); // Store the ID of the invoice to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };
  const toast = useToast()
  const handleConfirmDelete = async () => {
    try {
      console.log("selectedEmployeeId: ", selectedEmployeeId)
      await deleteEmployee(selectedEmployeeId);
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully.",
        status: "success",
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      });
      handleAddOrUpdateEmployee()
      // Remove the deleted invoice from the list
      // const updatedInvoices = invoices.filter((invoice) => invoice.InvoiceData.id !== selectedInvoiceId);
      // onDeleteInvoice(updatedInvoices); // Call the prop function to update the parent's state
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 3000,
          position: 'top-right',
          isClosable: true,
        });
      }
      console.error("Error deleting invoice:", error);
    } finally {
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
      setSelectedEmployeeId(null); // Reset the selected invoice ID
    }
  };
  console.log("searched", filteredEmployees);
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
        <Flex align="end">
          <InputGroup maxW="300px">
            <InputLeftElement
              pointerEvents="none"
              color="gray.400"
              fontSize="1.2em"
              ml={2}
            >
              <BiSearch />
            </InputLeftElement>
            <Input
              placeholder="Search by full name, email or department"
              borderRadius="0.5rem"
              py={2}
              pl={10}
              pr={3}
              mr={2}
              fontSize="md"
              _placeholder={{ color: "gray.400" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Flex>
        <Button
          colorScheme="blue"
          borderRadius="0.5rem"
          px={8}
          py={3}
          // size={{base:"sm", md:"md"}}
          fontSize={{base:"sm", md:"md"}}
          onClick={() => openDrawer("addNew", null)}
        >
          Add New Employee
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              {/* <Th>DOB</Th> */}
              <Th>Department</Th>
              <Th>Position</Th>
              {/* <Th>Phone</Th> */}
              <Th>Email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEmployees.map((employee) => (
              <Tr key={employee.id}>
                <Td>{employee.name}</Td>
                <Td>{employee.surname}</Td>
                {/* <Td>{new Date(employee.birthday).toLocaleDateString()}</Td> */}
                <Td>{employee.department}</Td>
                <Td>{employee.position}</Td>
                {/* <Td>{employee.phone}</Td> */}
                <Td>{employee.email}</Td>
                <Td>
                  <Button colorScheme="green" size="sm" mr={2} onClick={() => openDrawer("message", employee)}>
                    <EmailIcon mr={2} /> Send Message
                  </Button>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<HiDotsVertical />}
                      variant='ghost'
                      size='sm'
                    />
                    <MenuList>
                      <MenuItem
                        icon={<BiShow />}
                        onClick={() => openDrawer("show", employee)}
                      >
                        Show
                      </MenuItem>
                      <MenuItem
                        icon={<FiEdit />}
                        onClick={() => openDrawer("edit", employee)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={<FiTrash2 />}
                        onClick={() => handleDeleteClick(employee.id)}
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
      <DrawersE
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        drawerType={selectedDrawerType}
        data={selectedEmployeeData}
        handleAddOrUpdateEmployee={handleAddOrUpdateEmployee}
      />
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Employee"}
        BodyText={"Are you sure you want to delete this Employee?"}
      />
    </Box>
  );
};

export default EmployeeList;