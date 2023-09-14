// src\admin\components\invoices\LposhowDrawer.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Text,
  useColorModeValue,
  SimpleGrid,
  Button,
  Badge,
  HStack,
  Divider,
  Flex,
  Container,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { getPaymentsByInvoiceId } from "../../../API/api";
import EditDrawer from "./LpoeditDrawer";
import PdfDrawer from "./LpoPdfDrawer";
import EditRecordPaymentDrawer from "./LpoeditRecordPaymentDrawer";
import { getInvoiceById } from "../../../API/api";
import DeleteAlert from "../../../components/common/DeleteAlert";
import { deletePayment } from "../../../API/api";

// const items = [
//   { name: "Item 1", price: 10, quantity: 2 },
//   { name: "Item 2", price: 5, quantity: 1 },
//   { name: "Item 3", price: 15, quantity: 3 },
// ];
const InvoiceItem = ({ name,price, subtotal, quantity,height, width, }) => {


  return (
    <Tr>
      <Td>{name}</Td>
      <Td>{height}</Td>
      <Td>{width}</Td>
      <Td>AED {price}</Td>
      <Td>{quantity}</Td>
      <Td>AED {subtotal}</Td>
    </Tr>
  );
};
const statusColors = {
  DRAFT: "blue",
  PENDING: "yellow",
  SENT: "green",
  EXPIRED: "orange",
  DECLINED: "red",
  ACCEPTED: "teal",
  LOST: "gray",
};
const paymentColors = {
  PAID: "green",
  "PARTIALLY PAID": "yellow",
  UNPAID: "red",
};

const LpoShowDrawer = ({ data, handleUpdateInvoice }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const totalAmount = data.InvoiceItemsData.reduce(
    (total, item) => total + item.item_price * item.item_quantity,
    0
  );
  console.log(data);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState();
  const toast = useToast();
  const [paymentRecords, setPaymentRecords] = useState([]);

  const handleConfirmDelete = async () => {
    try {
      await deletePayment(selectedPaymentId);
      toast({
        title: "Payment Record Deleted",
        description: "The payment record has been deleted successfully.",
        position: "top-right",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Fetch payment records again to update the list after deletion
      fetchPaymentRecords();
      handleUpdateInvoice();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error deleting payment record",
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
        console.error("Error deleting payment record:", error);
      }
    } finally {
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
      setSelectedPaymentId(null); // Reset the selected invoice ID
    }
  };

  useEffect(() => {
    // Fetch payment records when the component mounts
    const fetchPaymentRecords = async () => {
      try {
        const response = await getPaymentsByInvoiceId(data.InvoiceData.id);
        setPaymentRecords(response.payments);
      } catch (error) {
        console.error("Error fetching payment records:", error);
      }
    };

    fetchPaymentRecords();
  }, [data]);
  const fetchPaymentRecords = async () => {
    try {
      const response = await getPaymentsByInvoiceId(data.InvoiceData.id);
      console.log("Response of fetch payment again", response);
      if (response.status === 404) {
        // Handle the case where the invoice does not exist
        setPaymentRecords([]); // Set paymentRecords to an empty array
      } else if (
        response.data &&
        response.data.success === false &&
        response.data.message === "No payments found for the provided invoice"
      ) {
        // Handle the case where no payments are found for the invoice
        setPaymentRecords([]); // Set paymentRecords to an empty array
      } else {
        // Payments found, update paymentRecords
        setPaymentRecords(response.payments);
      }
    } catch (error) {
      setPaymentRecords([]);
      console.error("Error fetching payment records:", error);
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isEditRecordPaymentDrawerOpen, setIsEditRecordPaymentDrawerOpen] =
    useState(false); // State to control EditRecordPaymentDrawer
  const [selectedPaymentData, setSelectedPaymentData] = useState(null);

  const openEditDrawer = () => {
    setIsEditOpen(true);
  };
  const openPdfDrawer = () => {
    setIsPdfOpen(true);
  };
  const handleEditPayment = (payment) => {
    setSelectedPaymentData(payment);

    setIsEditRecordPaymentDrawerOpen(true);
  };
  console.log("befor update invoice data ", data);
  console.log("befor update invoice data ", data);
  const fetchInvoiceData = async () => {
    try {
      const invoiceId = data.InvoiceData.id; // Replace with the actual way you get the invoice ID
      const invoiceData = await getInvoiceById(invoiceId);
      data = invoiceData;
      // Update other data fields as needed
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };
  const handleDeleteClick = () => {
    // setSelectedInvoiceId(invoiceId); // Store the ID of the invoice to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };
  return (
    <Box>
      {isEditOpen ? (
        // Render EditDrawer when in edit mode
        <EditDrawer
          data={data}
          onClose={() => setIsEditOpen(false)}
          handleUpdateInvoice={handleUpdateInvoice}
        />
      ) : isPdfOpen ? (
        <PdfDrawer data={data} onClose={() => setIsPdfOpen(false)} />
      ) : isEditRecordPaymentDrawerOpen ? (
        <EditRecordPaymentDrawer
          data={data}
          fetchPaymentRecords={fetchPaymentRecords}
          paymentData={selectedPaymentData}
          onClose={() => {
            setIsEditRecordPaymentDrawerOpen(false);
            fetchInvoiceData();
          }}

          // handleUpdateInvoice={/* Function to update the invoice */}
        />
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
          <SimpleGrid columns={{ base: 1, md: 2 }}>
            <HStack>
              <Text fontWeight="bold" fontSize="lg">
                LPO # {data.InvoiceData.number}
              </Text>
              <Badge
                colorScheme={paymentColors[data.InvoiceData.payment_status]}
                variant="solid"
                fontSize="0.8rem"
              >
                {data.InvoiceData.payment_status}
              </Badge>
            </HStack>
            <HStack justify="end">
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={openEditDrawer}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={openPdfDrawer}
              >
                Download PDF
              </Button>
            </HStack>
          </SimpleGrid>

          <Stack direction="row" justify="space-around" align="start" mt={4}>
            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Status
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                {data.InvoiceData.status}
              </Text>
            </SimpleGrid>

            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Sub Total
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                AED {data.InvoiceData.total_amount}
              </Text>
            </SimpleGrid>
            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Total
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                AED{" "}
                {(data.InvoiceData.total_amount +
                  (data.InvoiceData.total_amount / 100) * 5 -
                  data.InvoiceData.discount).toFixed(2)}
              </Text>
            </SimpleGrid>
            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Balance
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                AED{" "}
                {(data.InvoiceData.total_amount +
                  (data.InvoiceData.total_amount / 100) * 5 -
                  data.InvoiceData.discount -
                  data.InvoiceData.total_amount_paid).toFixed(2)}
              </Text>
            </SimpleGrid>
          </Stack>

          <Divider orientation="horizontal" my={4} />
          <Stack direction="row">
            <SimpleGrid columns={2}>
              <Text fontWeight="bold">Client:</Text>
              <Text fontWeight="bold">
                {data.InvoiceData.client_fname +
                  " " +
                  data.InvoiceData.client_lname}
              </Text>
            </SimpleGrid>
          </Stack>

          <Divider orientation="horizontal" borderColor="0000" my={8} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <HStack spacing={2}>
              <Text>Email:</Text>
              <Text>{data.InvoiceData.client_email}</Text>
            </HStack>
            <HStack spacing={2}>
              <Text>Phone:</Text>
              <Text>{data.InvoiceData.client_phone}</Text>
            </HStack>
            <HStack spacing={2}>
              <Text>Delivery Location:</Text>
              {/* <Text>{data.InvoiceData.location}</Text> */}
            </HStack>
            <HStack spacing={2}>
              <Text>Project Name</Text>
              {/* <Text>{data.InvoiceData.pname}</Text> */}
            </HStack>
          </SimpleGrid>
          <Divider orientation="horizontal" borderColor="0000" my={4} />

          <TableContainer>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>height</Th>
                  <Th>Width</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.InvoiceItemsData.map((item, index) => (
                  <InvoiceItem
                    key={index}
                    name={item.item_name}
                    height={item.item_ydim}
                    width={item.item_xdim}
                    description={item.item_description}
                    quantity={item.item_quantity}
                    price={item.item_price}
                    subtotal={item.item_subtotal}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box>
            <Divider orientation="horizontal" my={4} />
            <Flex direction="column" align="flex-end" justify="flex-end" mt={2}>
              <HStack>
                <Text>Sub Total:</Text>
                <Text fontWeight="bold">AED {data.InvoiceData.total_amount}</Text>
              </HStack>
              <HStack>
                <Text>VAT Tax(5%):</Text>
                <Text fontWeight="bold">AED {((data.InvoiceData.total_amount / 100) * 5).toFixed(2)}</Text>
              </HStack>
              <HStack>
                <Text>Discount:</Text>
                <Text fontWeight="bold">AED {data.InvoiceData.discount}</Text>
              </HStack>
              <HStack>
                <Text>Total Amount:</Text>
                <Text fontWeight="bold">
                  AED{" "}
                  {(data.InvoiceData.total_amount +
                    (data.InvoiceData.total_amount / 100) * 5 -
                    data.InvoiceData.discount).toFixed(2)}
                </Text>
              </HStack>
            </Flex>
          </Box>

          <Divider orientation="horizontal" borderColor="0000" my={4} />
          <Flex direction="column">
            <Container align="center" justify="center">
              <Text fontSize="lg" fontWeight="bold" align="center">
                Past Payment Records
              </Text>
            </Container>

            <Divider orientation="horizontal" my={4} />
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Actions</Th>
                    <Th>Date</Th>
                    <Th>Amount ($)</Th>
                    <Th>Payment Mode</Th>
                    <Th>Reference</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentRecords.map((payment) => (
                    <Tr key={payment.id}>
                      <Td>
                        <HStack>
                          <Button colorScheme="yellow" variant="ghost">
                            <EditIcon
                              onClick={() => handleEditPayment(payment)}
                            />
                          </Button>
                          <Button
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteClick(payment.id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </HStack>
                      </Td>
                      <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                      <Td>{payment.amount}</Td>
                      <Td>{payment.payment_mode_id}</Td>
                      <Td>{payment.reference}</Td>
                      <Td>{payment.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>
        </Box>
      )}
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Payment Record"}
        BodyText={"Are you sure you want to delete this Payment record?"}
      />
    </Box>
  );
};

export default LpoShowDrawer;
