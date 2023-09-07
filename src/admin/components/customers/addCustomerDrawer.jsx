// src\admin\components\customers\addCustomerDrawer.jsx
import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  Stack,
  Box,
  useToast,
  Input,
  SimpleGrid,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AddClient } from "../../../API/api";
const AddCustomerDrawer = ({
  isOpen,
  onClose,
  onSave,
  handleFetchUpdatedCustomer,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [newCustomer, setNewCustomer] = useState({
    company: "",
    managerSurname: "",
    managerName: "",
    email: "",
    phone: "",
    // Other fields...
  });

  const [errors, setErrors] = useState({
    company: "",
    managerSurname: "",
    managerName: "",
    email: "",
    phone: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Basic validation
    let error = "";
    if (name === "email" && value && !validateEmail(value)) {
      error = "Invalid email format";
    }
    if (name === "phone" && value && !validatePhone(value)) {
      error = "Invalid phone number";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };
  const toast = useToast();

  const handleSaveClick = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    // Check for validation errors
    const validationErrors = {};
    for (const field in newCustomer) {
      if (!newCustomer[field]) {
        validationErrors[field] = "Required";
      }
    }
    if (!validateEmail(newCustomer.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!validatePhone(newCustomer.phone)) {
      validationErrors.phone = "Invalid phone number";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await AddClient({
          fname: newCustomer.managerName, // Assuming managerName corresponds to first name
          lname: newCustomer.managerSurname, // Assuming managerSurname corresponds to last name
          email: newCustomer.email,
          phone: newCustomer.phone,
          date: formattedDate, // You might need to adjust this date format
          company_name: newCustomer.company,
          added_by_employee: "1", // added by employee ki id session se ayegi
        });
        // Show success message
        // After successfully adding a customer, update the customers state

        toast({
          title: "Client Added",
          description: "Client added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Update the customers state by adding the new customer
        // console.log("newCustomer: ", newCustomer);
        // console.log("prevCustomers: ", prevCustomers);
        // console.log(" response.data: ", response.data)
        // console.log(" response: ", response)
        handleFetchUpdatedCustomer();
        onClose(onClose);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          // Show the specific error message from the API response
          toast({
            title: "Error",
            description: error.response.data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        // Handle API error, show a message or take appropriate action
        console.error("Error adding client:", error);
      }
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Add New Customer</DrawerHeader>
        <DrawerBody>
          <FormControl isRequired>
            <Stack
              spacing={8}
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="md"
              p={4}
              shadow="md"
              width="100%"
            >
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Company:</FormLabel>
                  <Input
                    name="company"
                    type="text"
                    value={newCustomer.company}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>
                {errors.company && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.company}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">First Name:</FormLabel>
                  <Input
                    name="managerSurname"
                    type="text"
                    value={newCustomer.managerSurname}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>
                {errors.managerSurname && (
                  <Text color="red.500" ml={150} fontSize="sm">
                    {errors.managerSurname}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Last Name:</FormLabel>
                  <Input
                    name="managerName"
                    type="text"
                    value={newCustomer.managerName}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>
                {errors.managerName && (
                  <Text color="red.500" ml={150} fontSize="sm">
                    {errors.managerName}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Email:</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>
                {errors.email && (
                  <Text color="red.500" ml={150} fontSize="sm">
                    {errors.email}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Contact Number</FormLabel>
                  <Input
                    name="phone"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                  />
                </SimpleGrid>
                {errors.phone && (
                  <Text color="red.500" ml={150} fontSize="sm">
                    {errors.phone}
                  </Text>
                )}
              </Box>
            </Stack>
          </FormControl>
        </DrawerBody>

        <DrawerFooter justifyContent="start">
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="solid" colorScheme="green" mr={3} onClick={handleSaveClick}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* Popup for success or error message */}
    </Drawer>
  );
};

export default AddCustomerDrawer;
