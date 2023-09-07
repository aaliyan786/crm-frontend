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
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { createAnnouncement } from "../../../API/api";

function SendMessageE({ data, onClose }) {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputStyles = {
    border: "1px solid grey",
  };

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(""); // Fix: Changed state variable name
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleCreateAnnouncement = async () => {
    try {
      const announcementData = {
        title: title,
        priority: Number(priority),
        description: message,
        email: data.email, // Assuming `data` has the employee's ID
      };
      console.log("Announcement Data:", announcementData);
      const response = await createAnnouncement(announcementData);
      toast({
        title: "Announcement Created",
        description: "The announcement has been created successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      // Clear form fields
      setTitle("");
      setPriority(""); // Fix: Clear priority state
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : "Error sending Announcement",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      // Handle error or show an error message
      console.error("Error creating announcement:", error);
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
      <Flex direction="row">
        <Text fontSize="xl" fontWeight="bold">
          Message for {data.name + " " + data.surname}
        </Text>
      </Flex>
      <Divider orientation="horizontal" my={4} />

      <FormControl isRequired>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Message Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyles}
            />
          </Box>

          <Box>
            <FormLabel>Priority</FormLabel>
            <Select
              placeholder="Set Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)} // Fix: Changed state variable name
              style={inputStyles}
            >
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </Select>
          </Box>
        </SimpleGrid>
        <Divider orientation="horizontal" my={4} />

        <FormLabel>Message</FormLabel>
        <Textarea
          size="md"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Fix: Changed state variable name
          height="200px"
          placeholder="Please enter message."
          style={inputStyles}
        />
      </FormControl>

      <Divider orientation="horizontal" my={4} borderColor="grey" />
      <HStack>
        <Button variant="outline" colorScheme="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          colorScheme="green"
          onClick={handleCreateAnnouncement}
        >
          Send Message <FiSend style={{ marginLeft: "0.5rem" }} />
        </Button>
      </HStack>
    </Box>
  );
}

export default SendMessageE;
