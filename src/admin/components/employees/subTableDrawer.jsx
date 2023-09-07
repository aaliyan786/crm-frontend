import React, { useState, useEffect } from "react";
import {
  Badge,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { HiDotsVertical } from "react-icons/hi";
import { BiShow, BiEdit, BiCreditCard, BiFile, BiTrash } from "react-icons/bi";
import DrawersQ from "../quotes/drawers";
import Drawers from "../invoices/drawers";
import { getQuotesByEmployee, getInvoicesByEmployee } from "../../../API/api";

function SubTableDrawer({ data, employeeDepartment }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDrawerType, setSelectedDrawerType] = useState("");
  const [selectedQuoteData, setSelectedQuoteData] = useState(null);

  const [isIDrawerOpen, setIsIDrawerOpen] = useState(false);
  const [selectedIDrawerType, setSelectedIDrawerType] = useState("");
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);

  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const openDrawer = (drawerType, quoteData) => {
    setSelectedDrawerType(drawerType);
    setSelectedQuoteData(quoteData);
    setIsDrawerOpen(true);
  };

  const openIDrawer = (drawerType, invoiceData) => {
    setSelectedIDrawerType(drawerType);
    setSelectedInvoiceData(invoiceData);
    setIsIDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDrawerType("");
    setSelectedQuoteData(null);
  };

  const closeIDrawer = () => {
    setIsIDrawerOpen(false);
    setSelectedIDrawerType("");
    setSelectedInvoiceData(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (employeeDepartment === "sales") {
          const response = await getQuotesByEmployee(data.id);
          setQuotes(response.quotes);
        } else if (employeeDepartment === "accounts") {
          const response = await getInvoicesByEmployee(data.id);
          console.log(response.invoicesAndItems)
          setInvoices(response.invoicesAndItems);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [employeeDepartment, data.id]);
  return (
    <>
      {employeeDepartment === "sales" && (
        <>
          <Flex direction="row" justify="center" my={6}>
            <Text fontSize="xl" fontWeight="bold">
              Employee's Quotes
            </Text>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Quote Number</Th>
                  <Th>Client</Th>
                  <Th>Date</Th>
                  <Th>Due Date</Th>
                  {/* <Th>Added by</Th> */}
                  <Th>Total</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {quotes.map((quote) => (
                  <Tr key={quote.quote_number}>
                    <Td>{quote.quote_number}</Td>
                    <Td>{quote.client_name}</Td>
                    <Td>{new Date(quote.quote_date).toLocaleDateString()}</Td>
                    <Td>{new Date(quote.valid_until).toLocaleDateString()}</Td>
                    {/* <Td>{quote.added_by}</Td> */}
                    <Td>{quote.total_amount}</Td>
                    <Td>
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        variant="outline"
                        // colorScheme={statusColors[quote.status]}
                      >
                        pending
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<HiDotsVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<BiShow />}
                            onClick={() => openDrawer("show", quote)}
                          >
                            Show
                          </MenuItem>
                          <MenuItem
                            icon={<BiEdit />}
                            onClick={() => openDrawer("edit", quote)}
                          >
                            Edit
                          </MenuItem>
                         
                          <MenuItem
                            icon={<BiFile />}
                            onClick={() => openDrawer("pdf", quote)}
                          >
                            Download PDF
                          </MenuItem>
                          <MenuItem
                            // onClick={() => handleDeleteClick(customer)}
                            icon={<BiTrash />}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                   
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <DrawersQ
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            drawerType={selectedDrawerType}
            data={selectedQuoteData}
          />
        </>
      )}
      {employeeDepartment === "accounts" && (
        <>
          <Flex direction="row" justify="center" my={6}>
            <Text fontSize="xl" fontWeight="bold">
              Employee's Invoices
            </Text>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Client</Th>
                  <Th>Date</Th>
                  <Th>Due Date</Th>
                  {/* <Th>Added by Employee</Th> */}
                  <Th>Total</Th>
                  <Th>Balance</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoices.map((invoice) => (
                  <Tr key={invoice.invoice_id}>
                    <Td>{invoice.number}</Td>
                    <Td>{invoice.client_name}</Td>
                    <Td>
                      {new Date(
                        invoice.invoice_current_date
                      ).toLocaleDateString()}
                    </Td>
                    <Td>
                      {new Date(invoice.expiry_date).toLocaleDateString()}
                    </Td>
                    {/* <Td>{invoice.added_by_employee}</Td> */}
                    <Td>{invoice.total_amount}</Td>
                    <Td>{invoice.total_amount - invoice.payment_amount}</Td>
                    <Td>
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        variant="outline"
                        // colorScheme={statusColors[invoice.status]}
                      >
                        DRAFT
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="md"
                        variant="solid"
                        // colorScheme={paymentColors[invoice.payment_status]}
                      >
                        UNPAID
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<HiDotsVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<BiShow />}
                            onClick={() => openIDrawer("show", data)}
                          >
                            Show
                          </MenuItem>
                          <MenuItem
                            icon={<BiEdit />}
                            onClick={() => openIDrawer("edit", data)}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={<BiCreditCard />}
                            onClick={() => openIDrawer("recordPayment", data)}
                          >
                            Record Payment
                          </MenuItem>
                          <MenuItem
                            icon={<BiFile />}
                            onClick={() => openIDrawer("pdf", data)}
                          >
                            Download PDF
                          </MenuItem>
                          <MenuItem
                            // onClick={() => handleDeleteClick(customer)}
                            icon={<BiTrash />}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Drawers
            isOpen={isIDrawerOpen}
            onClose={closeIDrawer}
            drawerType={selectedIDrawerType}
            data={selectedInvoiceData}
          />
        </>
      )}
    </>
  );
}

export default SubTableDrawer;
