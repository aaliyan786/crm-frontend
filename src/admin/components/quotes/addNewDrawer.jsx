import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  IconButton,
  useColorModeValue,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { createQuoteApi, fetchCustomers } from "../../../API/api";

function AddNewDrawer({ handleAddUpdateDeleteQuote, onClose }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [tableRows, setTableRows] = useState([]);
  const inputStyles = {
    border: "1px solid grey",
  };

  const handleAddRow = () => {
    const newRow = {
      item_name: "",
      item_description: "",
      item_quantity: 0,
      item_xdim: 0,
      item_ydim: 0,
      item_price: 0,
    };

    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = tableRows.filter((_, i) => i !== index);
    setTableRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;
    setTableRows(updatedRows);
  };

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSaveQuote = async () => {
    setIsLoading(true);

    console.log(selectedClient);
    const selectedExpiryDateISO = selectedExpiryDate
      ? new Date(selectedExpiryDate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
      : null; // Set to null if selectedExpiryDate is not provided
    // console.log(selectedExpiryDateISO);
    // console.log(selectedExpiryDate);
    // console.log('selectedClient',selectedClient)
    let email=localStorage.getItem("email");
    const quoteData = {
      client_email: selectedClient,
      status: selectedStatus,
      employee_email: email, //emp ki email ayegi
      expiry_date: selectedExpiryDateISO,
      terms_and_condition: termsAndConditions,
      payment_terms: paymentTerms,
      execution_time: executionTime,
      // isPerforma: selectedType === 2 ? 1 : 0,
      // item_tax: 0,
      bank_details: bankDetails,
      note: noteDetails,
    };
    console.log("data", quoteData);
    console.log(tableRows);
    const quoteItemsData = tableRows.map((row) => ({
      item_name: row.item_name,
      item_description: row.item_description,
      item_quantity: row.item_quantity,
      item_xdim: row.item_xdim,
      item_ydim: row.item_ydim,
      item_price: row.item_price,
      item_subtotal: row.item_quantity * row.item_price,
      item_tax: 1, // You can calculate tax here if needed
      item_total: row.item_quantity * row.item_price, // This may need to include tax
    }));
    const storedToken = localStorage.getItem("token"); // Retrieve the token from localStorage
    console.log(selectedClient);
    try {
      const response = await createQuoteApi(
        {
          quoteData,
          quoteItemsData,
        },
        storedToken
      ); // Pass the storedToken as the second argument
      console.log(response);

      console.log(response);

      if (response.success) {
        const newQuoteId = response.QuoteId;
        handleAddUpdateDeleteQuote();
      }

      setIsLoading(false);
      // Show success toast
      toast({
        title: "Quote Created",
        description: "The Quote has been created successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleAddUpdateDeleteQuote();
      onClose(onClose);

      // Do something with the response, if needed
    } catch (error) {
      setIsLoading(false);
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
          description: "error adding quotes",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        console.error("Error creating Quote:", error);
      }
    }
  };

  const [customers, setCustomers] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [noteDetails, setNoteDetails] = useState("");

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
  const vatTax = 0.05 * subTotal; // 5% VAT tax
  const totalAmount = subTotal + vatTax;
  // BAKI KRLENA PLIS
  return (
    <Box
      spacing={10}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      shadow="md"
      width="100%"
    >
      <Flex direction="row" justify="space-between">
        <HStack>
          {/* <Text fontWeight='bold' fontSize='lg'>Quote # YAHAN WO (SHERJEEL RANDOM NUMBER AYEGA)</Text>
                    <Badge colorScheme="red" variant='solid' fontSize='0.8rem'>(STATUS?)</Badge> */}
        </HStack>
        <HStack>
          <Button variant="ghost" onClick={onClose}>
            <SmallCloseIcon
              mr={2}
              borderRadius="50%"
              border="1px solid black"
            />{" "}
            Cancel
          </Button>
          <Button
            size="sm"
            variant="solid"
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleSaveQuote}
          >
            <AddIcon mr={4} /> Save Quote
          </Button>
      
        </HStack>
      </Flex>
      <Divider orientation="horizontal" my={4} />

      <FormControl isRequired>
        <SimpleGrid columns={{ base: 3 }} spacing={4}>
          <Box>
            <FormLabel>Client</FormLabel>
            <VStack align="start">
              <InputGroup>
                <Input
                  value={selectedClientName} // Use selectedClientName as the value
                  onChange={handleSearchChange}
                  bg={bgColor}
                  placeholder="Search for a client"
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

          <Box>
            <FormLabel>Status</FormLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value={1}>Draft</option>
              <option value={2}>Pending</option>
              <option value={3}>Sent</option>
              <option value={4}>Expired</option>
              <option value={5}>Declined</option>
              {/* <option value={6}>Accepted</option> */}
              <option value={7}>Lost</option>
            </Select>
          </Box>
          {/* <Box>
            <FormLabel>Type</FormLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value={1}>Tax Quote</option>
              <option value={2}>Performa Quote</option>
            </Select>
          </Box> */}
          {/* <Box>
            <FormLabel>Date</FormLabel>
            <Input  value={executionTime}
        onChange={(e) => setExecutionTime(e.target.value)} type="date" style={inputStyles}></Input>
          </Box> */}
          <Box>
            <FormLabel>Expiry Date</FormLabel>
            <Input
              value={selectedExpiryDate}
              onChange={(e) => setSelectedExpiryDate(e.target.value)}
              type="date"
              style={inputStyles}
            ></Input>
          </Box>
        </SimpleGrid>
      </FormControl>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={6} />

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Description</Th>
              <Th>Dimension X</Th>
              <Th>Dimension Y</Th>
              <Th>Quantity</Th>
              <Th>Price</Th>
              <Th>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableRows.map((row, index) => (
              <>
                <Tr key={index}>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.item_name}
                      onChange={(e) =>
                        handleInputChange(index, "item_name", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.description}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "item_description",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.dimensionX}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "item_xdim", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.dimensionY}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "item_ydim", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.quantity}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "item_quantity",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      style={inputStyles}
                      value={row.price}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(index, "item_price", e.target.value)
                      }
                    />
                  </Td>

                  <Td>{row.item_quantity * row.item_price}</Td>

                  <Td>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Divider orientation="horizontal" my={4} />

      <Flex justify="center" align="center">
        <Button
          variant="outline"
          colorScheme="teal"
          fontWeight="light"
          onClick={handleAddRow}
        >
          <AddIcon mr={2} />
          Add field
        </Button>
      </Flex>
      <FormControl isRequired>
        <Divider orientation="horizontal" borderColor="7F7F7F" my={4} />
        <SimpleGrid columns={2} spacing={6}>
          <VStack align="start">
            <FormLabel>Note</FormLabel>
            <Textarea
              value={noteDetails}
              onChange={(e) => setNoteDetails(e.target.value)}
              // value={value}
              // onChange={handleNoteInputChange}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
          <VStack align="start">
            <FormLabel>T&C</FormLabel>
            <Textarea
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
        </SimpleGrid>

        <Divider orientation="horizontal" my={4} />
        <SimpleGrid columns={3} spacing={4}>
          <VStack align="start">
            <FormLabel>Payment Terms</FormLabel>
            <Textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
          <VStack align="start">
            <FormLabel>Execution Time</FormLabel>
            <Textarea
              value={executionTime}
              onChange={(e) => setExecutionTime(e.target.value)}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
          <VStack align="start">
            <FormLabel>Bank Details</FormLabel>
            <Textarea
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
        </SimpleGrid>
      </FormControl>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={4} />
      <Divider orientation="horizontal" my={4} />

      <Flex
        direction="column"
        align="flex-end"
        justify="flex-end"
        mt={2}
        fontSize="lg"
      >
        <HStack>
          <Text>Sub Total:</Text>
          <Text fontWeight="bold">AED {subTotal.toFixed(2)}</Text>
        </HStack>
        <HStack>
          <Text>VAT (5%):</Text>
          <Text fontWeight="bold">AED {vatTax.toFixed(2)}</Text>
        </HStack>
        <HStack>
          <Text>Total Amount:</Text>
          <Text fontWeight="bold">AED {totalAmount.toFixed(2)}</Text>
        </HStack>
      </Flex>
    </Box>
  );
}

export default AddNewDrawer;
