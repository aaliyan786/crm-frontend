import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Text,
  Button,
  Stack,
  useToast,
  Box,
  Input,
  SimpleGrid,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
// import { updateClientDetails } from "../../../API/api";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { updateClientDetails } from "../../../API/api";

const EditCustomerDrawer = ({
  isOpen,
  onClose,
  customerDetails,
  onSave,
  handleFetchUpdatedCustomer,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [editedCustomer, setEditedCustomer] = useState({
    company_name: customerDetails.company_name,
    lname: customerDetails.lname,
    fname: customerDetails.fname,
    email: customerDetails.email,
    phone: customerDetails.phone,
    // added_by_employee: customerDetails.added_by_employee,
    // Other fields...
  });

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const requiredFieldsFilled =
      editedCustomer.company_name &&
      editedCustomer.lname &&
      editedCustomer.fname &&
      editedCustomer.email &&
      editedCustomer.phone;
    // ... add more required fields here

    setIsFormValid(requiredFieldsFilled);
  }, [editedCustomer]);

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
    setEditedCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

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

  const toast = useToast();
  const handleSaveClick = async () => {
    // const currentDate = new Date();
    // const formattedDate = currentDate.toISOString().slice(0, 10);
    // Check for validation errors
    const validationErrors = {};
    for (const field in editedCustomer) {
      if (!editedCustomer[field]) {
        validationErrors[field] = "Required";
      }
    }
    if (!validateEmail(editedCustomer.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!validatePhone(editedCustomer.phone)) {
      validationErrors.phone = "Invalid phone number";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        await updateClientDetails(customerDetails.id, editedCustomer);
        toast({
          title: "Invoice Created",
          description: "The record has been updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        handleFetchUpdatedCustomer();
        onClose(onClose);
        // Pass the updated data to the onSave callback
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
        console.error("Error editing client:", error);
        // Handle API error, show a message or take appropriate action
      }
    }
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
          Edit Customer Details
        </DrawerHeader>
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
                  <FormLabel fontWeight="bold">Company Name:</FormLabel>
                  <Input
                    name="company_name"
                    value={editedCustomer.company_name}
                    onChange={handleInputChange}
                    required
                  />
                </SimpleGrid>
                {errors.company_name && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.company_name}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Manager Surname:</FormLabel>
                  <Input
                    name="lname"
                    value={editedCustomer.lname}
                    onChange={handleInputChange}
                    required
                  />
                </SimpleGrid>
                {errors.lname && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.lname}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Manager Name:</FormLabel>
                  <Input
                    name="fname"
                    value={editedCustomer.fname}
                    onChange={handleInputChange}
                    required
                  />
                </SimpleGrid>
                {errors.fname && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.fname}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Email:</FormLabel>
                  <Input
                    name="email"
                    value={editedCustomer.email}
                    onChange={handleInputChange}
                    required
                  />
                </SimpleGrid>
                {errors.email && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.email}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <FormLabel fontWeight="bold">Phone:</FormLabel>
                  <Input
                    name="phone"
                    value={editedCustomer.phone}
                    onChange={handleInputChange}
                    required
                  />
                </SimpleGrid>
                {errors.phone && (
                  <Text ml={150} color="red.500" fontSize="sm">
                    {errors.phone}
                  </Text>
                )}
              </Box>
              <Box>
                <SimpleGrid templateColumns="repeat(2, 20% 80%)" spacing="24px">
                  <Box fontWeight="bold">Added by:</Box>
                  <Box>{customerDetails.added_by_employee}</Box>
                </SimpleGrid>
              </Box>
            </Stack>
          </FormControl>
        </DrawerBody>

        <DrawerFooter justifyContent="start">
          <Button
            variant="outline"
            mr={3}
            onClick={handleSaveClick}
            disabled={!isFormValid}
          >
            Save
          </Button>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* Popup for success or error message */}
      {/* {popupMessage && (
        <Box
          position="fixed"
          bottom={10}
          right={10}
          zIndex="popover"
          p={3}
          borderRadius="md"
          bgColor={popupType === "success" ? "green.500" : "red.500"}
          color="white"
        >
          {popupMessage}
        </Box>
      )} */}
    </Drawer>
  );
};

export default EditCustomerDrawer;
