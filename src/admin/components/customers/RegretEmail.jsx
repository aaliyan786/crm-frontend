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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi"; // Import FiSend

// Assuming these imports are correct
import { sendRegretEmail } from "../../../API/api";

const RegretEmail = ({ isOpen, onClose, customerDetails, onSend, onEdit }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [description, setdescription] = useState("");
  const [subject, setSubject] = useState(""); // Add subject state

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setdescription(value);
    } else if (name === "subject") {
      setSubject(value); // Update subject state
    }
  };

  const handleSendEmailClick = async () => {
    try {
      const response = await sendRegretEmail(
        1, //employee id
        subject, // Use the subject state
        customerDetails.id,
        description,
        "password" //employee password
      );

      console.log("Email sent successfully:", response);
      toast({
        title: "Email Send",
        description: "The email has been send successfully",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      onClose();
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
      } else {
        toast({
          title: "Error",
          description: "Error sending email",
          status: "error",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
        console.error("Email sending error:", error);
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
          Send Regret Email
        </DrawerHeader>
        <DrawerBody>
          <Stack
            spacing={10}
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            shadow="md"
            width="100%"
          >
            <Box>
              <SimpleGrid templateColumns="repeat(2, 30% 70%)" spacing="24px">
                <Text fontWeight="bold">Company name: </Text>
                <Text>{customerDetails?.company_name}</Text>
              </SimpleGrid>
            </Box>

            <Box>
              <SimpleGrid templateColumns="repeat(2, 30% 70%)" spacing="24px">
                <Text fontWeight="bold">Email: </Text>
                <Text>{customerDetails?.email}</Text>
              </SimpleGrid>
            </Box>
          </Stack>
          <Box
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            shadow="md"
            width="100%"
            mt={5}
          >
            <FormControl isRequired>
              <FormLabel>Title.</FormLabel>
              <Input
                type="text"
                border="1px solid gray"
                name="subject" // Add a name attribute
                onChange={handleInputChange}
                value={subject}
              />
              <FormLabel>Description.</FormLabel>
              <Textarea
                name="description" // Add a name attribute
                value={description}
                onChange={handleInputChange}
                placeholder="Enter description to send."
                size="sm"
                minH="3xs"
                border="1px solid gray"
              />
            </FormControl>
            <Button
              variant="solid"
              colorScheme="green"
              mt={4}
              onClick={handleSendEmailClick}
            >
              Send Email <FiSend style={{ marginLeft: "0.4rem" }} />
            </Button>
          </Box>
        </DrawerBody>

        <DrawerFooter justifyContent="start" bg={bgColor}>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RegretEmail;
