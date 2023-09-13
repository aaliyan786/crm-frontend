import React, { useEffect, useState } from "react";
import {
  Badge,
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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  SmallCloseIcon,
  LockIcon,
} from "@chakra-ui/icons";
import {
  addInvoiceItem,
  deleteInvoiceItem,
  editInvoiceItem,
  updateInvoiceData,
} from "../../../API/api";
function EditDrawer({ data, handleUpdateInvoice, onClose }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [tableRows, setTableRows] = useState(data.InvoiceItemsData);
  const inputStyles = {
    border: "1px solid grey",
  };
  console.log("invoice edit: ", data);
  const handleAddRow = () => {
    // Create a new row template
    const newRow = {
      item_name: "",
      item_description: "",
      item_quantity: "",
      // price: "",
      item_xdim: "",
      item_ydim: "",
      item_price: 0,
      calculationType: 0,
      item_total: 0,
      item_quantity_disabled: true, // Initialize these properties
      item_xdim_disabled: false, // Initialize these properties
      item_ydim_disabled: false,
    };

    // Initialize the properties for each existing row in tableRows
    const updatedRows = tableRows.map((row) => ({
      item_name: row.item_name,
      item_description: row.item_description,
      item_quantity: row.item_quantity,
      // price: row.price,
      item_xdim: row.item_xdim,
      item_ydim: row.item_ydim,
      item_price: row.item_price,
      calculationType: row.calculationType,
      item_total: row.item_total,
      item_quantity_disabled:
        row.item_xdim * row.item_ydim * row.item_price === row.item_total,
      item_xdim_disabled: row.item_quantity * row.item_price === row.item_total,
      item_ydim_disabled: row.item_quantity * row.item_price === row.item_total,
    }));

    // Add the newly created row to the updatedRows array
    updatedRows.push(newRow);

    // Update the state with the updatedRows
    setTableRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const itemToDelete = tableRows[index];
    if (itemToDelete.id) {
      // If the item has an ID, mark it for deletion
      setRemovedItems([...removedItems, itemToDelete]);
    }
    const updatedRows = tableRows.filter((_, i) => i !== index);
    setTableRows(updatedRows);
  };
  const [subtotalAmount, setSubtotalotalAmount] = useState(
    data.InvoiceData.total_amount
  );

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;
    if (updatedRows[index].calculationType === 0) {
      updatedRows[index].item_quantity = 1;
      updatedRows[index].item_total =
        updatedRows[index].item_xdim *
        updatedRows[index].item_ydim *
        updatedRows[index].item_price;
    } else if (updatedRows[index].calculationType === 1) {
      updatedRows[index].item_total =
        updatedRows[index].item_quantity * updatedRows[index].item_price;
    }
    // Update the disabled state based on the Calculation Type
    if (field === "calculationType") {
      if (value === "0") {
        updatedRows[index].item_quantity = 1;
        updatedRows[index].calculationType = 0;
        updatedRows[index].item_total =
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
        updatedRows[index].item_total =
          updatedRows[index].item_quantity * updatedRows[index].item_price;
        updatedRows[index].item_quantity_disabled = false;
        updatedRows[index].item_xdim_disabled = true;
        updatedRows[index].item_ydim_disabled = true;
      }
    }
    if (updatedRows[index].calculationType === 0) {
      updatedRows[index].item_quantity = 1;
      updatedRows[index].item_total =
        updatedRows[index].item_xdim *
        updatedRows[index].item_ydim *
        updatedRows[index].item_price;
    } else if (updatedRows[index].calculationType === 1) {
      updatedRows[index].item_total =
        updatedRows[index].item_quantity * updatedRows[index].item_price;
      updatedRows[index].item_xdim = 0;
      updatedRows[index].item_ydim = 0;
    }

    // Recalculate sub total for the edited row
    updatedRows[index].item_subtotal =
      updatedRows[index].item_quantity * updatedRows[index].item_price;

    setTableRows(updatedRows);

    // Recalculate total amount
    const newTotalAmount = updatedRows.reduce(
      (total, row) => total + row.item_subtotal,
      0
    );
    setSubtotalotalAmount(newTotalAmount);
  };

  // TEXT AREA INPUT HANDLES(NOTE, T&CS, PAYMENT TERMS, EXECUTION TIME, BANK DETAILS )
  const statusColors = {
    DRAFT: "blue",
    PENDING: "yellow",
    SENT: "green",
    EXPIRED: "orange",
    DECLINED: "red",
    ACCEPTED: "teal",
    LOST: "gray",
  };

  const statusValue = {
    DRAFT: 1,
    PENDING: 2,
    SENT: 3,
    EXPIRED: 4,
    DECLINED: 5,
    ACCEPTED: 6,
    LOST: 7,
  };
  const typeValue = {
    "TAX INVOICE": 1,
    "PERFORMA INVOICE": 2,
  };
  const [selectedStatus, setSelectedStatus] = useState(
    statusValue[data.InvoiceData.status]
  );
  const [selectedType, setSelectedType] = useState(
    typeValue[data.InvoiceData.isPerforma]
  );
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(
    new Date(data.InvoiceData.expiry_date).toISOString().split("T")[0]
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    data.InvoiceData.terms_and_condition
  );
  const [paymentTerms, setPaymentTerms] = useState(
    data.InvoiceData.payment_terms
  );
  const [executionTime, setExecutionTime] = useState(
    data.InvoiceData.execution_time
  );
  const [bankDetails, setBankDetails] = useState(data.InvoiceData.bank_details);
  const [noteDetails, setNoteDetails] = useState(data.InvoiceData.note);
  const [discount, setDiscount] = useState(data.InvoiceData.discount);

  const [removedItems, setRemovedItems] = useState([]);
  const [hasAtLeastOneItem, setHasAtLeastOneItem] = useState(false);

  // useEffect to check if there's at least one item in the invoice items array
  useEffect(() => {
    setHasAtLeastOneItem(tableRows.length > 0);
  }, [tableRows]);
  const toast = useToast();

  const handleSaveInvoice = async () => {
    if (!hasAtLeastOneItem) {
      toast({
        title: "No Invoice Items",
        item_description: "The invoice must have at least one item.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
    // Update invoice data fields
    let email = localStorage.getItem("email");
    const currentDate = new Date();
    const todayISO = currentDate.toISOString().split("T")[0];
    const updatedInvoiceData = {
      status: selectedStatus,
      employee_email: email, // emp ki email ayegi
      expiry_date: todayISO,
      discount: discount,
      terms_and_condition: termsAndConditions,
      payment_terms: paymentTerms,
      execution_time: executionTime,
      isPerforma: selectedType - 1,
      bank_details: bankDetails,
      note: noteDetails,
      // ... (other fields)
    };
    console.log("data", updatedInvoiceData);
    try {
      console.log("data", updatedInvoiceData);

      // Update invoice data
      await updateInvoiceData(data.InvoiceData.id, updatedInvoiceData);

      // Update or add invoice items
      for (const row of tableRows) {
        if (row.id) {
          // If the row has an ID, it's an existing item that needs to be updated
          console.log("row.item_subtotal: ", row.item_subtotal);
          console.log("row.item_total: ", row.item_total);
          console.log("row.total_amount: ", row.total_amount);
          await editInvoiceItem(row.id, {
            item_name: row.item_name,
            item_description: row.item_description,
            item_quantity: row.item_quantity,
            item_xdim: row.item_xdim,
            item_ydim: row.item_ydim,
            item_price: row.item_price,
            item_subtotal: row.item_total,
            item_tax: row.item_tax,
            item_total: row.item_total,
          });
        } else {
          console.log("add new item: ",row)
          // If the row doesn't have an ID, it's a new item that needs to be added
          await addInvoiceItem(data.InvoiceData.id, {
            item_name: row.item_name,
            item_description: row.item_description,
            item_quantity: row.item_quantity,
            item_xdim: row.item_xdim,
            item_ydim: row.item_ydim,
            item_price: row.item_price,
            item_subtotal: row.item_total,
            item_total: row.item_total,
            item_tax: 0,
          });
          console.log("data", updateInvoiceData);
        }
      }

      // Delete removed invoice items
      for (const removedItem of removedItems) {
        await deleteInvoiceItem(removedItem.id);
      }

      // Handle success
      toast({
        title: "Invoice Updated",
        item_description: "The invoice has been updated successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleUpdateInvoice();
      onClose(onClose);
      // You might want to trigger a UI update or redirect here
    } catch (error) {
      // Handle error
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          item_description: error.response.data.error,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else console.error("Error saving invoice:", error);
      // Handle error state or display an error message
    }
  };

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
          <Text fontWeight="bold" fontSize="lg">
            {data.InvoiceData.number}
          </Text>
          <Badge
            colorScheme={statusColors[data.InvoiceData.status]}
            variant="solid"
            fontSize="0.8rem"
          >
            {data.InvoiceData.status}
          </Badge>
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
            variant="solid"
            colorScheme="blue"
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
            <FormLabel>
              Client
              <LockIcon ml={2} color="gray.500" />
            </FormLabel>
            <Input
              isReadOnly
              type="text"
              style={inputStyles}
              value={
                data.InvoiceData.client_fname +
                " " +
                data.InvoiceData.client_lname
              }
            />
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
              <option value={6}>Accepted</option>
              <option value={7}>Lost</option>
            </Select>
          </Box>
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

            <Input
              value={discount} // Use selectedClientName as the value
              onChange={(e) => setDiscount(e.target.value)}
              bg={bgColor}
              type="number"
              placeholder="Enter Discount"
            />
          </Box>
        </SimpleGrid>
      </FormControl>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={6} />

      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>item_description</Th>
              <Th>Dimension X</Th>
              <Th>Dimension Y</Th>
              <Th>item_quantity</Th>
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
                    value={row.item_description}
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
                    <option value={1}>item_quantity</option>
                  </Select>
                </Td>
                <Td>
                  <Input
                    style={inputStyles}
                    value={row.item_price}
                    type="number"
                    onChange={(e) =>
                      handleInputChange(index, "item_price", e.target.value)
                    }
                  />
                </Td>
                <Td>{row.item_total}</Td>
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

      <Divider orientation="horizontal" borderColor="7F7F7F" my={4} />
      <SimpleGrid columns={2} spacing={6}>
        <VStack align="start">
          <Text>Note</Text>
          <Textarea
            value={noteDetails}
            onChange={(e) => setNoteDetails(e.target.value)}
            placeholder="Here is a sample placeholder"
            size="sm"
          />
        </VStack>
        <VStack align="start">
          <Text>T&C</Text>
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
          <Text>Payment Terms</Text>
          <Textarea
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            placeholder="Here is a sample placeholder"
            size="sm"
          />
        </VStack>
        <VStack align="start">
          <Text>Execution Time</Text>
          <Textarea
            value={executionTime}
            onChange={(e) => setExecutionTime(e.target.value)}
            placeholder="Here is a sample placeholder"
            size="sm"
          />
        </VStack>
        <VStack align="start">
          <Text>Bank Details</Text>
          <Textarea
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value)}
            placeholder="Here is a sample placeholder"
            size="sm"
          />
        </VStack>
      </SimpleGrid>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={4} />
      <Divider orientation="horizontal" my={4} />

      <SimpleGrid columns={1} spacing={10}>
        <Flex
          direction="column"
          align="flex-end"
          justify="flex-end"
          mt={2}
          fontSize="lg"
        >
          <HStack>
            <Text>Sub Total:</Text>
            <Text fontWeight="bold">AED {subtotalAmount}</Text>
          </HStack>
          <HStack>
            <Text>Vat Tax (5%):</Text>
            <Text fontWeight="bold">AED {(subtotalAmount / 100) * 5}</Text>
          </HStack>
          <HStack>
            <Text>Discount:</Text>
            <Text fontWeight="bold">AED {data.InvoiceData.discount}</Text>
          </HStack>
          <HStack>
            <Text>Total Amount:</Text>
            <Text fontWeight="bold">
              AED{" "}
              {subtotalAmount +
                (subtotalAmount / 100) * 5 -
                data.InvoiceData.discount}
            </Text>
          </HStack>
        </Flex>
      </SimpleGrid>
    </Box>
  );
}

export default EditDrawer;
