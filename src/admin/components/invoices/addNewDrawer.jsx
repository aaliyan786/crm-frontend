// src\admin\components\invoices\addNewDrawer.jsx
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
import { createInvoiceApi, fetchCustomers } from "../../../API/api";

function AddNewDrawer({ onAddNewInvoice, onClose, handleUpdateInvoice }) {
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
      calculationType: 0,
      totalPrice: 0,
      item_quantity_disabled: true, // Initialize these properties
      item_xdim_disabled: false, // Initialize these properties
      item_ydim_disabled: false, // Initialize these properties
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

    if (updatedRows[index].calculationType === 0) {
      updatedRows[index].item_quantity = 1;
      updatedRows[index].totalPrice =
        updatedRows[index].item_xdim *
        updatedRows[index].item_ydim *
        updatedRows[index].item_price;
    } else if (updatedRows[index].calculationType === 1) {
      updatedRows[index].totalPrice =
        updatedRows[index].item_quantity * updatedRows[index].item_price;
    }
    // Update the disabled state based on the Calculation Type
    if (field === "calculationType") {
      if (value === "0") {
        updatedRows[index].item_quantity = 1;
        updatedRows[index].calculationType = 0;
        updatedRows[index].totalPrice =
          updatedRows[index].item_xdim *
          updatedRows[index].item_ydim *
          updatedRows[index].item_price;
        updatedRows[index].item_quantity_disabled = true;
        updatedRows[index].item_xdim_disabled = false;
        updatedRows[index].item_ydim_disabled = false;
      } else if (value === "1") {
        updatedRows[index].item_xdim = 0;
        updatedRows[index].item_ydim = 0;
        updatedRows[index].calculationType = 1;
        updatedRows[index].totalPrice =
          updatedRows[index].item_quantity * updatedRows[index].item_price;
        updatedRows[index].item_quantity_disabled = false;
        updatedRows[index].item_xdim_disabled = true;
        updatedRows[index].item_ydim_disabled = true;
      }
    }
    if (updatedRows[index].calculationType === 0) {
      console.log("dim");
      updatedRows[index].item_quantity = 1;
      updatedRows[index].totalPrice =
        updatedRows[index].item_xdim *
        updatedRows[index].item_ydim *
        updatedRows[index].item_price;
      console.log("Price: ", updatedRows[index].totalPrice);
      console.log("item_xdim: ", updatedRows[index].item_xdim);
      console.log("item_ydim: ", updatedRows[index].item_ydim);
    } else if (updatedRows[index].calculationType === 1) {
      updatedRows[index].totalPrice =
        updatedRows[index].item_quantity * updatedRows[index].item_price;
      updatedRows[index].item_xdim = 0;
      updatedRows[index].item_ydim = 0;
    }

    setTableRows(updatedRows);
  };

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSaveInvoice = async () => {
    setIsLoading(true);

    let email = localStorage.getItem("email");
    const currentDate = new Date();
    const todayISO = currentDate.toISOString().split("T")[0]; // Get the date part in ISO format

    const invoiceData = {
      client_email: selectedClient,
       status: selectedStatus,
      employee_email: email, // emp ki email ayegi
      expiry_date: todayISO, // Set it to today's date
      discount: discount,
      terms_and_condition: termsAndConditions,
      payment_terms: paymentTerms,
      execution_time: executionTime,
      isPerforma: selectedType - 1,
      bank_details: bankDetails,
      note: noteDetails,
      is_LPO: 0,
    };

    // Prepare invoice items data based on the form input
    console.log(tableRows);
    const invoiceItemsData = tableRows.map((row) => ({
      item_name: row.item_name,
      item_description: row.item_description,
      item_quantity: row.item_quantity,
      item_xdim: row.item_xdim,
      item_ydim: row.item_ydim,
      item_price: row.item_price,
      item_subtotal: row.totalPrice,
      item_tax: 0, // You can calculate tax here if needed
      item_total: row.totalPrice, // This may need to include tax
    }));
    const storedToken = localStorage.getItem("token");
    try {
      const response = await createInvoiceApi(
        {
          invoiceData,
          invoiceItemsData,
        },
        storedToken
      );
      console.log(response);
      // Assuming response.data contains the newly created invoice data
      if (response.success) {
        const newInvoiceId = response.InvoiceId;
        onAddNewInvoice(newInvoiceId);
      }
      // Call the onAddNewInvoice prop function with the new invoice data
      setIsLoading(false);
      // Show success toast
      toast({
        title: "Invoice Created",
        description: "The invoice has been created successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleUpdateInvoice();
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
      } else console.error("Error creating invoice:", error);
    }
  };

  const [customers, setCustomers] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [selectedType, setSelectedType] = useState(1);

  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [noteDetails, setNoteDetails] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const customerData = await fetchCustomers();
        setCustomers(customerData.data);
      } catch (error) {
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

    setSelectedClientName(query);

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
  const subTotal = tableRows.reduce((total, row) => total + row.totalPrice, 0);
  const vatTax = 0.05 * subTotal; // 15% VAT tax
  const totalAmount = subTotal + vatTax;

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
        <HStack></HStack>
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
            variant="solid"
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleSaveInvoice}
          >
            <AddIcon mr={4} /> Save Invoice
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
          {/* <Box> */}
          {/* <FormLabel>Status</FormLabel> */}
          {/* <Select */}
          {/* value={selectedStatus} */}
          {/* onChange={(e) => setSelectedStatus(e.target.value)} */}
          {/* > */}
          {/* <option value={1}>Draft</option> */}
          {/* <option value={2}>Pending</option> */}
          {/* <option value={3}>Sent</option> */}
          {/* <option value={4}>Expired</option> */}
          {/* <option value={5}>Declined</option> */}
          {/* <option value={6}>Accepted</option> */}
          {/* <option value={7}>Lost</option> */}
          {/* </Select> */}
          {/* </Box> */}

          <Box>
            <FormLabel>Type</FormLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value={1}>Tax invoice</option>
              <option value={2}>Performa invoice</option>
            </Select>
          </Box>
          <Box>
            <FormLabel>Discount</FormLabel>
            <InputGroup>
              <Input
                value={discount} // Use selectedClientName as the value
                onChange={(e) => setDiscount(e.target.value)}
                bg={bgColor}
                type="number"
                placeholder="Enter Discount"
              />
            </InputGroup>
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
              <Th>Calculation Type</Th>
              <Th>Price</Th>
              <Th>Total</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableRows.map((row, index) => (
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
                    value={row.item_xdim}
                    type="number"
                    isDisabled={row.item_xdim_disabled} // Use isDisabled prop
                    onChange={(e) =>
                      handleInputChange(index, "item_xdim", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    style={inputStyles}
                    value={row.item_ydim}
                    type="number"
                    isDisabled={row.item_ydim_disabled} // Use isDisabled prop
                    onChange={(e) =>
                      handleInputChange(index, "item_ydim", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    style={inputStyles}
                    value={row.item_quantity}
                    type="number"
                    isDisabled={row.item_quantity_disabled} // Use isDisabled prop
                    onChange={(e) =>
                      handleInputChange(index, "item_quantity", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Select
                    value={row.calculationType}
                    onChange={(e) => {
                      handleInputChange(
                        index,
                        "calculationType",
                        e.target.value
                      );
                    }}
                  >
                    <option value={0}>Dimensions</option>
                    <option value={1}>Quantity</option>
                  </Select>
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
                <Td>{row.totalPrice}</Td>
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
              placeholder="Here is a sample placeholder"
              size="sm"
            />
          </VStack>
          <VStack align="start">
            <FormLabel>Terms and Conditions</FormLabel>
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
          <Text>Discount:</Text>
          <Text fontWeight="bold">AED {discount}</Text>
        </HStack>
        <HStack>
          <Text>Total Amount:</Text>
          <Text fontWeight="bold">
            AED {totalAmount + (totalAmount / 100) * 5 - discount}
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}

export default AddNewDrawer;
