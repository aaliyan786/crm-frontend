import React, { useState } from "react";
import {
  Box,
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Button,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import Drawers from "../invoices/drawers";
import { Link } from "react-router-dom";

const statusColors = {
  DRAFT: "blue",
  PENDING: "yellow",
  SENT: "green",
  EXPIRED: "orange",
  DECLINED: "red",
  ACCEPTED: "teal",
  LOST: "gray",
};

const DataTable = ({ data, title, buttonLabel, to }) => {
  // console.log("Hello",data)
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [serialNumber, setSerialNumber] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDrawerType, setSelectedDrawerType] = useState(null);

  const handleOptionClick = (item, drawerType) => {
    setSelectedItem(item);
    setSelectedDrawerType(drawerType);
  };
  console.log(data)

  return (
    <TableContainer
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow="md"
      my={4}
      textAlign="center">
      <SimpleGrid columns={2} justifyContent="space-between" mb={4}>
        <GridItem colSpan={2 / 3} style={{ justifySelf: "start" }}>
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            {title}
          </Text>
        </GridItem>
        <GridItem colSpan={1 / 3} style={{ justifySelf: "end" }}>
          <Link to={to}>
            <Button variant="solid" colorScheme="blue" size={{base:"sm",}}>
              {buttonLabel}
            </Button>
          </Link>
        </GridItem>
      </SimpleGrid>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>N#</Th>
            <Th>Client</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => ( // Changed from recentInvoicesData to data
            <Tr key={index}>
              <Td>{serialNumber + index}</Td>
              <Td>{item.client}</Td>
              <Td>{item.total}</Td>
              <Td>
                <Badge
                  fontSize="0.8em"
                  colorScheme={statusColors[item.status]}
                >
                  {item.status}
                </Badge>
              </Td>
              <Td>{item.date}</Td>

            </Tr>
          ))}
        </Tbody>
      </Table>

    </TableContainer>

  );
};

export default DataTable;
