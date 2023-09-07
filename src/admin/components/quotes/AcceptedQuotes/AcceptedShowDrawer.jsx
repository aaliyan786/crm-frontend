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
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { getPaymentsByQuoteId } from "../../../../API/api";

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

const AcceptedShowDrawer = ({ data }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const totalAmount = data.quoteItems.reduce(
    (total, item) => total + item.item_price * item.item_quantity,
    0
  );
  console.log("AcceptedShowDrawer", data);

  const [paymentRecords, setPaymentRecords] = useState([]);
  const actionBadgeColor = {
    YES: "green",
    NO: "red",
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
      <Stack direction="row" align="center" justify="space-between">
        <HStack>
          <Text fontWeight="bold" fontSize="lg">
            Quote # {data.number}
          </Text>
          {/* <Badge
            colorScheme={paymentColors[data.payment_status]}
            variant="solid"
            fontSize="0.8rem"
          >
            {data.payment_status}
          </Badge> */}
        </HStack>
        {/* <HStack>
          <Button variant="outline" colorScheme="blue">
            Edit
          </Button>
          <Button variant="outline" colorScheme="red">
            Download PDF
          </Button>
        </HStack> */}
      </Stack>

      <Stack direction="row" justify="space-around" align="start" mt={4}>
        <SimpleGrid row={2} spacing={2}>
          <Text fontSize="sm" fontWeight="lighter">
            Status
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {data.status}
          </Text>
        </SimpleGrid>

        <SimpleGrid row={2} spacing={2}>
          <Text fontSize="sm" fontWeight="lighter">
            Sub Total
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            AED {data.total_amount}
          </Text>
        </SimpleGrid>
        <SimpleGrid row={2} spacing={2}>
          <Text fontSize="sm" fontWeight="lighter">
            Total
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {data.total_amount}
          </Text>
        </SimpleGrid>
        {/* <SimpleGrid row={2} spacing={2}>
          <Text fontSize="sm" fontWeight="lighter">
            Balance
          </Text>
          <Text fontWeight="bold" fontSize="2xl">
            {data.total_amount - data.total_amount_paid}
          </Text>
        </SimpleGrid> */}
      </Stack>

      <Divider orientation="horizontal" my={4} />
      <Stack direction="row">
        <SimpleGrid columns={2}>
          <Text fontWeight="bold">Client:</Text>
          <Text fontWeight="bold">
            {data.client_fname + " " + data.client_lname}
          </Text>
        </SimpleGrid>
      </Stack>

      <Divider orientation="horizontal" borderColor="0000" my={8} />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <HStack spacing={2}>
          <Text>Email:</Text>
          <Text>{data.client_email}</Text>
        </HStack>
        <HStack spacing={2}>
          <Text>Phone:</Text>
          <Text>{data.client_phone}</Text>
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
            {data.quoteItems.map((item, index) => (
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
            <Text>Tax Total (0%):</Text>
            <Text fontWeight="bold">AED {totalAmount}</Text>
          </HStack>
          <HStack>
            <Text>Total Amount:</Text>
            <Text fontWeight="bold">AED {totalAmount}</Text>
          </HStack>
        </Flex>
      </Box>
      <Divider orientation="horizontal" borderColor="0000" my={8} />

      {/* <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Action Taken</Th>
              <Th>Message</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{data.assigned_to_employee}</Td>
              <Td pl={12}>
                <Badge
                  colorScheme={
                    actionBadgeColor[data.isDone === 0 ? "NO" : "YES"]
                  }
                  variant="solid"
                >
                  {data.isDone === 0 ? "NO" : "YES"}
                </Badge>
              </Td>
              <Td>
                <Textarea
                  size="sm"
                  value={
                    data.message === null
                      ? "No Message provided by Employee"
                      : data.message
                  }
                  readOnly
                ></Textarea>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer> */}
      {/* <Divider orientation="horizontal" borderColor="0000" my={4} />
      <Flex direction="column">
        <Container align="center" justify="center">
          <Text fontSize="lg" fontWeight="bold" align="center">
            Past Payment Records
          </Text>
        </Container>

        {/* <Divider orientation="horizontal" my={4} />
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
                        <EditIcon />
                      </Button>
                      <Button colorScheme="red" variant="ghost">
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
      </Flex> */}
    </Box>
  );
};

export default AcceptedShowDrawer;
