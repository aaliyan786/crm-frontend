// src\admin\components\Quotes\showDrawer.jsx
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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { getPaymentsByQuoteId } from "../../../API/api";
import EditDrawer from "./editDrawer";
import PdfDrawerQ from "./pdfDrawer";

// const items = [
//   { name: "Item 1", price: 10, quantity: 2 },
//   { name: "Item 2", price: 5, quantity: 1 },
//   { name: "Item 3", price: 15, quantity: 3 },
// ];
const QuoteItem = ({ name, price, quantity }) => {
  const total = price * quantity;

  return (
    <Tr>
      <Td>{name}</Td>
      <Td>AED {price}</Td>
      <Td>{quantity}</Td>
      <Td>AED {total}</Td>
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

const ShowDrawer = ({ data }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const totalAmount = data.quotesItemsData.reduce(
    (total, item) => total + item.item_price * item.item_quantity,
    0
  );
  console.log(data)

  const [paymentRecords, setPaymentRecords] = useState([]);

  useEffect(() => {
    // Fetch payment records when the component mounts
    const fetchPaymentRecords = async () => {
      try {
        const response = await getPaymentsByQuoteId(data.quotesData.id);
        setPaymentRecords(response.payments);
      } catch (error) {
        console.error("Error fetching payment records:", error);
      }
    };

    fetchPaymentRecords();
  }, [data]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const openEditDrawer = () => {
    setIsEditOpen(true);
  };
  const openPdfDrawer = () => {
    setIsPdfOpen(true);
  }

  return (
    <Box>
      {isEditOpen ? (
        <EditDrawer
          data={data}
          onClose={() => setIsEditOpen(false)}
        />
      ) : isPdfOpen ? (
        <PdfDrawerQ
          data={data}
          onClose={() => setIsPdfOpen(false)}
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
          <Stack direction="row" align="center" justify="space-between">
            <HStack>
              <Text fontWeight="bold" fontSize="lg">
                Quote # {data.quotesData.number}
              </Text>
              <Badge
                colorScheme={paymentColors[data.quotesData.payment_status]}
                variant="solid"
                fontSize="0.8rem"
              >
                {data.quotesData.payment_status}
              </Badge>
            </HStack>
            <HStack>
              <Button variant="outline" colorScheme="blue" onClick={openEditDrawer}>
                Edit
              </Button>
              <Button variant="outline" colorScheme="red" onClick={openPdfDrawer}>
                Download PDF
              </Button>
            </HStack>
          </Stack>

          <Stack direction="row" justify="space-around" align="start" mt={4}>
            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Status
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                {data.quotesData.status}
              </Text>
            </SimpleGrid>

            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Sub Total
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                AED {data.quotesData.total_amount}
              </Text>
            </SimpleGrid>
            <SimpleGrid row={2} spacing={2}>
              <Text fontSize="sm" fontWeight="lighter">
                Total
              </Text>
              <Text fontWeight="bold" fontSize="2xl">
                {data.quotesData.total_amount}
              </Text>
            </SimpleGrid>
            {/* <SimpleGrid row={2} spacing={2}>
          <Text fontSize="sm" fontWeight="lighter">
            Balance
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {data.quotesData.total_amount - data.quotesData.total_amount_paid}
          </Text>
        </SimpleGrid> */}
          </Stack>

          <Divider orientation="horizontal" my={4} />
          <Stack direction="row">
            <SimpleGrid columns={2}>
              <Text fontWeight="bold">Client:</Text>
              <Text fontWeight="bold">
                {data.quotesData.client_fname +
                  " " +
                  data.quotesData.client_lname}
              </Text>
            </SimpleGrid>
          </Stack>

          <Divider orientation="horizontal" borderColor="0000" my={8} />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>

            <HStack spacing={2}>
              <Text>Email:</Text>
              <Text>{data.quotesData.client_email}</Text>
            </HStack>
            <HStack spacing={2}>
              <Text>Phone:</Text>
              <Text>{data.quotesData.client_phone}</Text>
            </HStack>
          </SimpleGrid>
          <Divider orientation="horizontal" borderColor="0000" my={4} />

          <TableContainer>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Item</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.quotesItemsData.map((item, index) => (
                  <QuoteItem
                    key={index}
                    name={item.item_name}
                    description={item.item_description}
                    quantity={item.item_quantity}
                    price={item.item_price}
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
                <Text fontWeight="bold">AED {totalAmount}</Text>
              </HStack>
              <HStack>
                <Text>VAT (0%):</Text>
                <Text fontWeight="bold">AED {totalAmount}</Text>
              </HStack>
              <HStack>
                <Text>Total Amount:</Text>
                <Text fontWeight="bold">AED {totalAmount}</Text>
              </HStack>
            </Flex>
          </Box>

          <Divider orientation="horizontal" borderColor="0000" my={4} />
          
        </Box>
      )}

      
    </Box>
  );
};

export default ShowDrawer;
