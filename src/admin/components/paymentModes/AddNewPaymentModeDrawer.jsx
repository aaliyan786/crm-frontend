import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Switch,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { createPaymentMode } from "../../../API/api";

function AddNewPaymentModeDrawer({ onClose, handleAddOrUpdatepaymentMode }) {
  const [paymentModeData, setPaymentModeData] = useState({
    name: "",
    description: "",
    is_enabled: true,
    is_default: false,
  });
  const toast = useToast();
  const handleSave = async () => {
    try {
      await createPaymentMode(paymentModeData);
      toast({
        title: "Payment Mode",
        description: "Payment Mode added successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleAddOrUpdatepaymentMode(); // Refresh the payment modes list
      onClose(); // Close the drawer
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
      }
      console.error("Error creating payment mode:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentModeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column">
      <FormControl isRequired>
        <FormLabel mt={5}>Payment Mode Name:</FormLabel>
        <Input
          type="text"
          name="name"
          value={paymentModeData.name}
          onChange={handleInputChange}
        />
        <FormLabel mt={5}>Description:</FormLabel>
        <Input
          type="text"
          name="description"
          value={paymentModeData.description}
          onChange={handleInputChange}
        />
        <SimpleGrid columns={2} spacing={10} mt={5}>
          <Box>
            <FormLabel>Is Default Mode?</FormLabel>
            <Switch
              name="is_default"
              isChecked={paymentModeData.is_default}
              onChange={() =>
                setPaymentModeData((prevData) => ({
                  ...prevData,
                  is_default: !prevData.is_default,
                }))
              }
            />
          </Box>
          <Box>
            <FormLabel>Mode Enabled</FormLabel>
            <Switch
              name="is_enabled"
              isChecked={paymentModeData.is_enabled}
              onChange={() =>
                setPaymentModeData((prevData) => ({
                  ...prevData,
                  is_enabled: !prevData.is_enabled,
                }))
              }
            />
          </Box>
        </SimpleGrid>
      </FormControl>
      <Button variant="solid" colorScheme="blue" mt={8} onClick={handleSave}>
        Save
      </Button>
    </Flex>
  );
}

export default AddNewPaymentModeDrawer;
