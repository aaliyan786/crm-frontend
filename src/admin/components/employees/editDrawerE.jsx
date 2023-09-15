import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { updateEmployee } from "../../../API/api";
function EditDrawerE({ data, handleAddOrUpdateEmployee, onClose }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputStyles = {
    border: "1px solid grey",
  };
  const [inputData, setInputData] = useState({
    name: data.name,
    surname: data.surname,
    birthday: new Date(data.birthday).toISOString().substr(0, 10),
    department: data.department,
    position: data.position,
    phone: data.phone,
    email: data.email,
    // password: data.password,
  });

  const handleInputChange = (field, value) => {
    setInputData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const toast = useToast();
  const handleSubmit = async () => {
    try {
      const response = await updateEmployee(data.id, inputData);
      toast({
        title: "Employee Updated",
        description: "The Employee has been Updated successfully.",
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
          description: "Error updating employee",
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      console.error("Error updating employee:", error);
      // Add your error handling logic here, such as showing an error toast or message
    }
  };
  // BAKI KRLENA PLIS
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
            <AddIcon mr={4} /> Update employee
          </Button>
        </HStack>
      </Flex>
      <Divider orientation="horizontal" my={4} />

      <FormControl isRequired>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          

          <Box>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              value={inputData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={inputStyles}
              placeholder="ahmed"
            ></Input>
          </Box>
          <Box>
            <FormLabel>Last Name</FormLabel>
            <Input
              type="text"
              style={inputStyles}
              value={inputData.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              placeholder="Zahid"
            />
          </Box>
          {/* <Box>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={inputData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              style={inputStyles}
              placeholder="******"
            ></Input>
          </Box> */}

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
              value={inputData.department}
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
          <Box>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              // value={inputData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              style={inputStyles}
            ></Input>
          </Box>
        </SimpleGrid>
      </FormControl>
      <Divider orientation="horizontal" borderColor="7F7F7F" my={6} />
    </Box>
  );
}

export default EditDrawerE;
