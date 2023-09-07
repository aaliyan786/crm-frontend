import React, { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import SubTableDrawer from "./subTableDrawer";
import EditDrawerE from "./editDrawerE";
import { BiPen, BiPencil } from "react-icons/bi";
import { HiPencil } from "react-icons/hi";

function ShowDrawerE({ data, handleAddOrUpdateEmployee, onClose }) {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const shadowColor = useColorModeValue("gray.100", "gray.600");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEditDrawer = () => {
    setIsEditOpen(true);
  }

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
            <HStack>
              <Button variant="ghost" onClick={onClose}>
                <SmallCloseIcon
                  mr={2}
                  borderRadius="50%"
                  border="1px solid black"
                />{" "}
                Cancel
              </Button>
              
            </HStack>
          </Flex>
          <Divider orientation="horizontal" my={4} />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <FormLabel fontWeight="bold">Surname</FormLabel>
              <Text>{data.surname}</Text>
            </Box>

            <Box>
              <FormLabel fontWeight="bold">Name</FormLabel>
              <Text>{data.name}</Text>
            </Box>
            {/* <Box>
          <FormLabel>Password</FormLabel>
          <Text>{data.password}</Text>
        </Box> */}

            <Box>
              <FormLabel fontWeight="bold">DOB</FormLabel>
              <Text>{new Date(data.birthday).toLocaleDateString()}</Text>
            </Box>
            <Box>
              <FormLabel fontWeight="bold">Department</FormLabel>
              <Text>{data.department}</Text>
            </Box>
            <Box>
              <FormLabel fontWeight="bold">Position</FormLabel>
              <Text>{data.position}</Text>
            </Box>
            <Box>
              <FormLabel fontWeight="bold">Phone</FormLabel>
              <Text>{data.phone}</Text>
            </Box>
            <Box>
              <FormLabel fontWeight="bold">Email</FormLabel>
              <Text>{data.email}</Text>
            </Box>
          </SimpleGrid>
          <Divider orientation="horizontal" borderColor="gray.300" my={6} />
          <SubTableDrawer data={data} employeeDepartment={data.department} />
        </Box>
  );
}

export default ShowDrawerE;
