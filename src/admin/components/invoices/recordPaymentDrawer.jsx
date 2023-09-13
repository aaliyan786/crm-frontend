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
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { BiFileBlank } from "react-icons/bi";
import { fetchPaymentModes, makePayment } from "../../../API/api";
import ShowDrawer from "./showDrawer";

const RecordPaymentDrawer = ({ data, onClose, handleUpdateInvoice }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputStyles = {
    border: "1px solid grey",
  };

  //   const [tableRows, setTableRows] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  useEffect(() => {
    // Fetch payment modes when the component mounts
    async function fetchPaymentModesData() {
      try {
        const response = await fetchPaymentModes();
        const enabledPaymentModes = response.paymentModes.filter(mode => mode.is_enabled === 1);
  
        // Find the default payment mode
        const defaultPaymentMode = enabledPaymentModes.find(mode => mode.is_default === 1);
  
        // If no default mode, choose a random mode
        const selectedMode = defaultPaymentMode || enabledPaymentModes[Math.floor(Math.random() * enabledPaymentModes.length)];
  
        setPaymentModes(enabledPaymentModes);
        setSelectedPaymentMode(selectedMode.id);
        console.log(enabledPaymentModes);
      } catch (error) {
        console.error("Error fetching payment modes:", error);
      }
    }
  
    fetchPaymentModesData();
  }, []); // Empty dependency array ensures this runs only once after mounting
  

  const paymentColors = {
    PAID: "green",
    "PARTIALLY PAID": "yellow",
    UNPAID: "red",
  };
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);

  const openViewDrawer = () => {
    setIsViewOpen(true);
  };

  const toast = useToast();
  const handleRecordPayment = async () => {
    const paymentData = {
      invoice_id: data.InvoiceData.id,
      date: paymentDate,
      amount: paymentAmount,
      payment_mode_id: selectedPaymentMode,
      reference: paymentReference,
      description: paymentDescription,
    };
    console.log("555555555555555555555555555   : ", selectedPaymentMode);
    try {
      const response = await makePayment(paymentData);
      toast({
        title: "Payment Recorded",
        description: "payment recorded successfully",
        status: "success",
        position:'top-right',
        duration: 3000,
        isClosable: true,
      });
      handleUpdateInvoice();
      onClose(onClose);

      console.log("Payment made:", response);
      // Perform any necessary actions after successful payment
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
        console.error("Error making payment:", error);
      }
    }
  };

  return (
    <Box>
      {isViewOpen ? (
        <ShowDrawer data={data} onClose={onClose} />
      ) : (
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
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
          >
            <HStack>
              <Text fontWeight="bold" fontSize="lg">
                Invoice # {data.InvoiceData.number}
              </Text>
              <Badge
                colorScheme={paymentColors[data.InvoiceData.payment_status]}
                variant="solid"
                fontSize="0.8rem"
              >
                {data.InvoiceData.payment_status}
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
              <Button variant="solid" colorScheme="blue">
                <BiFileBlank
                  style={{ marginRight: "4px" }}
                  onClick={openViewDrawer}
                />{" "}
                Show Invoice
              </Button>
            </HStack>
          </Flex>
          <Divider orientation="horizontal" my={4} />

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            alignItems="start"
          >
            <Flex direction="column">
              <FormControl isRequired>
                <FormLabel my={4}>Date</FormLabel>
                <Input
                  type="date"
                  style={inputStyles}
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                ></Input>

                <FormLabel my={4}>Amount</FormLabel>
                <Input
                  type="number"
                  style={inputStyles}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                ></Input>

                <FormLabel my={4}>Payment Mode</FormLabel>
                <Select
                  style={inputStyles}
                  value={selectedPaymentMode}
                  onChange={(e) => setSelectedPaymentMode(e.target.value)}
                >
                  {paymentModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {console.log(mode.id)}
                      {mode.name}
                    </option>
                  ))}
                </Select>

                <FormLabel my={4}>Reference</FormLabel>
                <Input
                  type="text"
                  style={inputStyles}
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                ></Input>

                <FormLabel my={4}>Description</FormLabel>
                <Input
                  type="text"
                  style={inputStyles}
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                ></Input>
              </FormControl>
            </Flex>
            <Stack direction="column" mt={8} p={4} maxWidth="md">
              <Box>
                <HStack fontWeight="bold" justify="space-between">
                  <Text>Client: </Text>
                  <Text justifyItems="start">
                    {data.InvoiceData.client_fname +
                      " " +
                      data.InvoiceData.client_lname}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Email: </Text>
                  <Text>{data.InvoiceData.client_email}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Address: </Text>
                  <Text>{data.InvoiceData.client_address}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>VAT Number: </Text>
                  <Text>{data.InvoiceData.client_vat}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Phone: </Text>
                  <Text>{data.InvoiceData.client_phone}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Payment Status: </Text>
                  <Text>{data.InvoiceData.payment_status}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Sub Total: </Text>
                  <Text>AED {data.InvoiceData.total_amount}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Vat(5%):</Text>
                  <Text>AED {(data.InvoiceData.total_amount*(5/100)).toFixed(2)}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Discount:</Text>
                  <Text>AED {data.InvoiceData.discount} AED</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Total: </Text>
                  <Text>AED {((data.InvoiceData.total_amount+data.InvoiceData.total_amount*(5/100))-(data.InvoiceData.discount)).toFixed(2)}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Amount Paid: </Text>
                  <Text>AED {data.InvoiceData.total_amount_paid}</Text>
                </HStack>
              </Box>
              <Box>
                <HStack fontWeight="thin" justify="space-between">
                  <Text>Balance: </Text>
                  <Text>
                    AED {((data.InvoiceData.total_amount+data.InvoiceData.total_amount*(5/100))-(data.InvoiceData.discount) - data.InvoiceData.total_amount_paid).toFixed(2)}
                  </Text>
                </HStack>
              </Box>
            </Stack>
          </SimpleGrid>
          <Button
            variant="solid"
            colorScheme="blue"
            mt={4}
            onClick={handleRecordPayment}
          >
            Record Payment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RecordPaymentDrawer;
