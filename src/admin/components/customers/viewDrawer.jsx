import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Stack,
  Box,
  Text,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import DeleteAlert from "../../../components/common/DeleteAlert"; // Import the DeleteAlert component

const CustomerDrawer = ({ isOpen, onClose, customerDetails, onDelete, onEdit }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(customerDetails);
    setIsDeleteAlertOpen(false);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={onClose}
            variant="ghost"
            alignItems="center"
            justifyContent="center"
          />
          Show Customer Details
        </DrawerHeader>
                <DrawerBody>
                    <Stack spacing={10} bg={bgColor}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        shadow="md"
                        width="100%">
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Company name: </Text>
                                <Text>{customerDetails?.company_name}</Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>First Name: </Text>
                                <Text>{customerDetails?.lname} </Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Last Name </Text>
                                <Text>{customerDetails?.fname} </Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Email: </Text>
                                <Text>{customerDetails?.email}</Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Phone: </Text>
                                <Text>{customerDetails?.phone}</Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Address: </Text>
                                <Text>{customerDetails?.address}</Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>VAT Number: </Text>
                                <Text>{customerDetails?.vat}</Text>
                            </SimpleGrid>
                        </Box>
                        <Box>
                            <SimpleGrid templateColumns='repeat(2, 30% 70%)' spacing='24px'>
                                <Text fontWeight='bold'>Added by: </Text>
                                <Text>{customerDetails?.added_by_employee} </Text>
                            </SimpleGrid>
                        </Box>
                    </Stack>
                </DrawerBody>

                <DrawerFooter justifyContent="start" bg={bgColor}>
          <Button variant="outline" colorScheme="red" mr={3} onClick={handleDeleteClick}>
            Delete
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>

        {/* Render the DeleteAlert component */}
        <DeleteAlert
          isOpen={isDeleteAlertOpen}
          onClose={() => setIsDeleteAlertOpen(false)}
          onConfirmDelete={handleConfirmDelete}
          HeaderText={"Customer Delete"}
          BodyText={"All the data of this customer will be deleted. Including invoices and qoutations."}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerDrawer;