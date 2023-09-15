import { React, useState } from "react";
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
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";

import DeleteAlert from "../../../components/common/DeleteAlert"; // Import the DeleteAlert component
import { BiMailSend, BiSend } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { sendRegretEmail } from "../../../API/api";
const RegretEmail = ({
  isOpen,
  onClose,
  customerDetails,
  onDelete,
  onEdit,
}) => {
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

  const [description, setdescription] = useState("");
  const [subject, setSubject] = useState("");

  const handleInputChange = (e) => {
    const inputdescription = e.target.value;
    setdescription(inputdescription);
  };

  const handleSendEmailClick = async () => {
    try {
      const response = await sendRegretEmail(
        "1", // Replace with actual descriptions
        "Regret Email",
        "1",
        description, // Assuming description is the description
        "admin123"
      );

      // Handle the response as needed (e.g., show a success description)
      console.log("Email sent successfully:", response);

      // Close the drawer or perform any other action
      onClose();
    } catch (error) {
      // Handle errors (e.g., show an error description)
      console.error("Email sending error:", error);
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
              type="text" border="1px solid gray"
              onChange={handleInputChange}
              value={subject}
              >


              </Input>
              <FormLabel>description.</FormLabel>
              <Textarea
                value={description}
                onChange={handleInputChange}
                placeholder="Enter description to send."
                size="sm"
                minH="3xs"
                border="1px solid gray"
              />
            </FormControl>
            <Button variant="solid" colorScheme="green" mt={4}>
              Send Email <FiSend style={{ marginLeft: "0.4rem" }} />
            </Button>
          </Box>
        </DrawerBody>

        <DrawerFooter justifyContent="start" bg={bgColor}>
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
          BodyText={
            "All the data of this customer will be deleted. Including invoices and qoutations."
          }
        />
      </DrawerContent>
    </Drawer>
  );
};

export default RegretEmail;
