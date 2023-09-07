import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiShow } from "react-icons/bi";
import { FaBackward } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import DrawersPayM from "../components/paymentModes/drawers";
import { deletePaymentMode, getAllPaymentModes } from "../../API/api";
import DeleteAlert from "../../components/common/DeleteAlert";

function AdminPaymentModes() {
  const bgColorParent = useColorModeValue("gray.100", "gray.700");
  const bgColor = useColorModeValue("white", "gray.700");
  const [isLoading, setIsLoading] = useState(true);

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [paymentData, setPaymentData] = useState([]); // State to hold payment modes data
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        setIsLoading(true); // Set isLoading to true before fetching data
        const response = await getAllPaymentModes();
        if (response.success) {
          setPaymentData(response.paymentModes);
        }
      } catch (error) {
        console.error("Error fetching payment modes:", error);
      } finally {
        setIsLoading(false); // Set isLoading to false after fetching data (success or error)
      }
    };

    fetchPaymentModes();
  }, []);

  const handleAddOrUpdatepaymentMode = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before fetching data
      const response = await getAllPaymentModes();
      if (response.success) {
        setPaymentData(response.paymentModes);
      }
    } catch (error) {
      console.error("Error fetching payment modes:", error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching data (success or error)
    }
  };
  

  const [selectedDrawerType, setSelectedDrawerType] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);

  // ... (other code)

  const handleOptionClick = (drawerType, paymentMode) => {
    setSelectedDrawerType(drawerType);
    setSelectedPaymentMode(paymentMode);
  };
  const toast = useToast();
  const handleConfirmDelete = async () => {
    try {
      console.log(selectedPaymentMode);
      await deletePaymentMode(selectedPaymentMode);
      toast({
        title: "Payment Mode Deleted",
        description: "The payment mode has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      handleAddOrUpdatepaymentMode(); // Refresh the payment modes list
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      console.error("Error deleting payment mode:", error);
    } finally {
      setIsDeleteAlertOpen(false); // Close the delete confirmation dialog
    }
  };

  const handleDeleteClick = (paymentId) => {
    setSelectedPaymentMode(paymentId); // Store the ID of the invoice to be deleted
    setIsDeleteAlertOpen(true); // Open the delete confirmation dialog
  };
  return (
    <Box bg={bgColorParent} py={8} minH="100vh">
      <Container maxW="container.xl" marginRight="0">
        <Heading as="h1" size="xl" mb={4}>
          Payment Modes
        </Heading>

        {isLoading ? (
          <Center justifyContent="center">
            <div class="loader">
              <div class="cover"></div>
            </div>
          </Center>
        ) : (
          <Box
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            shadow="md"
            width="100%"
          >
            <Flex direction="row" justify="space-between" mb={6}>
              <Link to="/settings">
                <IconButton icon={<ArrowBackIcon />} />
              </Link>
              <HStack justify="end">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Refresh
                </Button>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => handleOptionClick("addNew", null)}
                >
                  {" "}
                  {/* Pass null for addNew */}
                  Add New Payment Mode
                </Button>
              </HStack>
            </Flex>
            <TableContainer>
              <Table variant="simple" size="lg">
                <Thead>
                  <Tr>
                    <Th>Payment Mode</Th>
                    <Th>Description</Th>
                    <Th>Is Default</Th>
                    <Th>Enabled</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentData.map((payment, index) => (
                    <Tr key={index}>
                      <Td>
                        <Text>{payment.name}</Text>
                      </Td>
                      <Td>
                        <Text>{payment.description}</Text>
                      </Td>
                      <Td>
                        <Switch
                          isReadOnly
                          size="md"
                          defaultChecked={payment.is_default}
                        />
                      </Td>
                      <Td>
                        <Switch
                          isReadOnly
                          size="md"
                          defaultChecked={payment.is_enabled}
                        />
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
                              onClick={() => handleOptionClick("show", payment)}
                            >
                              Show
                            </MenuItem>
                            <MenuItem
                              icon={<FiEdit />}
                              onClick={() => handleOptionClick("edit", payment)}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              onClick={() => handleDeleteClick(payment.id)}
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
          </Box>
        )}
      </Container>
      {selectedDrawerType && (
        <DrawersPayM
          isOpen={selectedDrawerType !== null}
          onClose={() => setSelectedDrawerType(null)}
          drawerType={selectedDrawerType}
          data={selectedPaymentMode}
          handleOptionClick={handleOptionClick}
          selectedDrawerType={selectedDrawerType}
          handleAddOrUpdatepaymentMode={handleAddOrUpdatepaymentMode}
        />
      )}
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        HeaderText={"Delete Invoice"}
        BodyText={"Are you sure you want to delete this invoice?"}
      />
    </Box>
  );
}

export default AdminPaymentModes;
