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
import {
  CloseIcon
} from "@chakra-ui/icons";
import { createQuoteApi, fetchCustomers } from "../../../API/api";



function TempAssignModal({
  handleAddUpdateDeleteQuote,
  onClose,
  isOpen, // Add isOpen prop to control modal visibility
}) {

  const bgColor = useColorModeValue("gray.100", "gray.700");

  const [tableRows, setTableRows] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    // Fetch customer data when the component mounts
    async function fetchData() {
      try {
        const customerData = await fetchCustomers();
        setCustomers(customerData.data); // Access the customer data inside the "data" array
      } catch (error) {
        // Handle the error here
        console.error("Error fetching customers:", error);
      }
    }

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [selectedClientName, setSelectedClientName] = useState("");

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    setSelectedClientName(query); // Update selectedClientName directly

    const filtered = customers.filter((customer) =>
      customer.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const inputRef = useRef(null); // Create a ref for the input element

  const handleSelectCustomer = (selectedCustomer) => {
    setSelectedClient(selectedCustomer.email);
    setSelectedClientName(selectedCustomer.company_name);
    setSearchQuery(""); // Clear the search query when selecting an option
    setFilteredCustomers([]); // Clear the filtered customers

    // Set the selected company name directly to the input value using the ref
    inputRef.current.value = selectedCustomer.company_name;
  };

  const handleClearSearch = () => {
    setSelectedClientName(""); // Clear the selected client name
    setSearchQuery(""); // Clear the search query
    setFilteredCustomers([]); // Clear the filtered customers
  };
  // Calculate sub-total, VAT tax, and total
  const subTotal = tableRows.reduce(
    (total, row) => total + row.item_quantity * row.item_price,
    0
  );
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
                    value={selectedClientName} // Use selectedClientName as the value
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
                  {filteredCustomers.map((customer) => (
                    <Button
                      key={customer.id}
                      justifyContent="start"
                      width="100%"
                      variant="ghost"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      {customer.company_name}
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
          <Button variant="solid" colorScheme="green">Assign Employee</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TempAssignModal;
