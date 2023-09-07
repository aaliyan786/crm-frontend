import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { updatePaymentModeRecord } from "../../../API/api";

function EditPaymentMode({ data, handleAddOrUpdatepaymentMode, onClose }) {
  const [mode, setMode] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [isEnabled, setIsEnabled] = useState(data.is_enabled);
  const [isDefault, setIsDefault] = useState(data.is_default);

  const toast = useToast();
  const handleUpdateClick = async () => {
    const updatedPaymentMode = {
      name: mode,
      description,
      is_enabled: isEnabled,
      is_default: isDefault,
    };

    try {
      const response = await updatePaymentModeRecord(
        data.id,
        updatedPaymentMode
      );
      toast({
        title: "Payment Mode",
        description: "Payment Mode updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      handleAddOrUpdatepaymentMode();
      onClose(onClose);
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
        console.error("Error updating payment mode:", error);
       
    }
  };

  return (
    <Flex direction="column">
      <FormControl isRequired>
        <FormLabel mt={5}>Payment Mode Name:</FormLabel>
        <Input
          type="text"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        />
        <FormLabel mt={5}>Description:</FormLabel>
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <SimpleGrid columns={2} spacing={10} mt={5}>
          <Box>
            <FormLabel>Is Default Mode?</FormLabel>
            <Switch
              defaultChecked={data.is_default}
              value={isDefault}
              // checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
          </Box>
          <Box>
            <FormLabel>Mode Enabled</FormLabel>
            <Switch
              defaultChecked={data.is_enabled}
              // checked={isEnabled}
              value={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
          </Box>
        </SimpleGrid>
      </FormControl>
      <Button
        variant="solid"
        colorScheme="blue"
        mt={8}
        onClick={handleUpdateClick}
      >
        Update
      </Button>
    </Flex>
  );
}

export default EditPaymentMode;
