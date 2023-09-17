import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  IconButton,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { fetchAllAccountsEmployee } from "../../../API/api";
import { convertQuoteToInvoice } from "../../../API/api";

function TempAssignModal({
  quoteId,
  handleAddUpdateDeleteQuote,
  onClose,
  isOpen, // Add isOpen prop to control modal visibility
}) {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  const [employees, setemployees] = useState([]);
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState("");

  useEffect(() => {
    // Log the selectedEmployeeId when it changes
    console.log("Selected employee ID: ", selectedEmployeeEmail);
  }, [selectedEmployeeEmail]); // Add

  useEffect(() => {
    // Fetch employee data when the component mounts
    async function fetchData() {
      try {
        const employeeData = await fetchAllAccountsEmployee();
        setemployees(employeeData.employees); // Access the employee data inside the "data" array
        console.log("employeeData", employeeData);
      } catch (error) {
        // Handle the error here
        console.error("Error fetching employees:", error);
      }
    }

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredemployees, setFilteredemployees] = useState(employees);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    setSelectedEmployeeName(query); // Update selectedEmployeeName directly

    const filtered = employees.filter((employee) => {
      const fullName = `${employee.name} ${employee.surname}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });

    setFilteredemployees(filtered);
  };

  const inputRef = useRef(null); // Create a ref for the input element

  const handleSelectemployee = (selectedemployee) => {
    setSelectedEmployeeEmail(selectedemployee.email);
    setSelectedEmployeeName(
      selectedemployee.name + " " + selectedemployee.surname
    );
    setSearchQuery(""); // Clear the search query when selecting an option
    setFilteredemployees([]); // Clear the filtered employees
    // Set the selected company name directly to the input value using the ref
    inputRef.current.value = selectedemployee.company_name;
  };

  const handleClearSearch = () => {
    setSelectedEmployeeName(""); // Clear the selected client name
    setSearchQuery(""); // Clear the search query
    setFilteredemployees([]); // Clear the filtered employees
  };

  const toast = useToast();
  // Handle the API call when assigning an employee
  const handleAssignEmployee = async () => {
    try {
      // Make the API call to convert the quote to an invoice and assign it to the selected employee
      await convertQuoteToInvoice(quoteId, selectedEmployeeEmail);
      toast({
        title: "Quote converted and assigned",
        description: `The quote converted to invoice and assigned to employee ${selectedEmployeeEmail}`,
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleAddUpdateDeleteQuote();
      onClose(onClose);
      // You can add any success handling here (e.g., displaying a success message)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 3000,
          position: "top-right",

          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error assigning quote to employee",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        // Handle errors (e.g., display an error message)
        console.error("Error assigning employee:", error);
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign To Employee</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <Box>
              <FormLabel>Employee Name</FormLabel>
              <VStack align="start">
                <InputGroup>
                  <Input
                    value={selectedEmployeeName} // Use selectedEmployeeName as the value
                    onChange={handleSearchChange}
                    bg={bgColor}
                    placeholder="Search for a employee"
                    ref={inputRef} // Add the ref here
                  />
                  {searchQuery && (
                    <InputRightElement>
                      <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        aria-label="Clear search"
                        onClick={handleClearSearch}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Box
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="md"
                  mt={1}
                  maxH="150px"
                  overflowY="auto"
                >
                  {filteredemployees.map((employee) => (
                    <Button
                      key={employee.id}
                      justifyContent="start"
                      width="100%"
                      variant="ghost"
                      onClick={() => handleSelectemployee(employee)}
                    >
                      {`${employee.name} ${employee.surname}`}
                    </Button>
                  ))}
                </Box>
              </VStack>
            </Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" colorScheme="red" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="green"
            onClick={handleAssignEmployee}
          >
            Assign Employee
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TempAssignModal;
