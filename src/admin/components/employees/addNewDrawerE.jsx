import React, { useState } from "react";
import {
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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { createEmployee } from "../../../API/api";


function AddNewDrawerE({ onClose, handleAddOrUpdateEmployee }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputStyles = {
    border: "1px solid grey",
  };

  const [inputData, setInputData] = useState({
    name: "",
    surname: "",
    birthday: "",
    department: "",
    position: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setInputData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
const toast=useToast()
  const handleSubmit = async () => {
    console.log(inputData);
    try {
       await createEmployee(inputData);
      toast({
        title: "Employee Added",
        description: "The Employee has been added successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleAddOrUpdateEmployee();
      onClose(onClose);
      // Add your success handling logic here, such as showing a success toast or updating the UI
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
      } else
        toast({
          title: "Error",
          description: "Error adding employee",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      console.error("Error creating employee:", error);
      console.log("Response data:", error.response?.data); // Log the response data for more details

      // Add your error handling logic here, such as showing an error toast or message
    }
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
      <Flex direction="row" justify="end">
        {/* <HStack >
                    <Text fontWeight='bold' fontSize='lg'>Invoice # YAHAN WO (SHERJEEL RANDOM NUMBER AYEGA)</Text>
                    <Badge colorScheme="red" variant='solid' fontSize='0.8rem'>(STATUS?)</Badge>
                </HStack> */}
        <HStack>
          <Button variant="ghost" onClick={onClose}>
            <SmallCloseIcon
              mr={2}
              borderRadius="50%"
              border="1px solid black"
            />{" "}
            Cancel
          </Button>
          <Button variant="solid" colorScheme="blue" onClick={handleSubmit}>
            <AddIcon mr={4} /> Add new employee
          </Button>
        </HStack>
      </Flex>
      <Divider orientation="horizontal" my={4} />

      <FormControl isRequired>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <FormLabel>Surname</FormLabel>
            <Input
              type="text"
              style={inputStyles}
              value={inputData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              placeholder="Zahid"
            />
          </Box>

          <Box>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={inputData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={inputStyles}
              placeholder="ahmed"
            ></Input>
          </Box>
          <Box>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={inputData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              style={inputStyles}
              placeholder="******"
            ></Input>
          </Box>

          <Box>
            <FormLabel>DOB</FormLabel>
            <Input
              type="date"
              value={inputData.birthday}
              onChange={(e) => handleInputChange("birthday", e.target.value)}
              style={inputStyles}
              placeholder="28 / 8 / 22"
            ></Input>
          </Box>
          <Box>
            <FormLabel>Department</FormLabel>
            <Select
              placeholder="Select Department"
              onChange={(e) => handleInputChange("department", e.target.value)}
            >
              <option value="sales">Sales</option>
              <option value="accounts">Accounts</option>
            </Select>
          </Box>
          <Box>
            <FormLabel>Position</FormLabel>
            <Input
              type="text"
              value={inputData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              style={inputStyles}
            ></Input>
          </Box>
          <Box>
            <FormLabel>Phone</FormLabel>
            <Input
              type="number"
              value={inputData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              style={inputStyles}
            ></Input>
          </Box>
          <Box>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={inputData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              style={inputStyles}
            ></Input>
          </Box>
        </SimpleGrid>
      </FormControl>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={6} />
    </Box>
  );
}

export default AddNewDrawerE;
