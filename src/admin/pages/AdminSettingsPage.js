import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { addOrUpdateAddress, addOrUpdateLogo, BASE_URL, addOrUpdateName, addOrUpdateStamp, addOrUpdateVatNumber, getAllSettings } from "../../API/api";

const AdminSettingsPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const bgColorCard = useColorModeValue("white", "gray.600");
  const [logoPreview, setLogoPreview] = useState(null);
  const [stampPreview, setStampPreview] = useState(null);
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [vatNumber, setVatNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const logoInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const toast = useToast();

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const logoFormData = new FormData();
      logoFormData.append("logo", file);
      console.log('formData.entries:', Array.from(logoFormData.entries())); // Convert iterator to array
      console.log('formData.keys:', Array.from(logoFormData.keys()));
      console.log('formData.keys:', Array.from(logoFormData.values()));
      try {
        await addOrUpdateLogo(logoFormData);
        toast({
          title: "Logo",
          description: "logo updated successfully",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        // Handle success or error
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
          console.error("Error uploading logo:", error);
          toast({
            title: "Error",
            description: 'Updation ERROR',
            status: "error",
            duration: 3000,
            position: "top-right",
            isClosable: true,
          });
        }
      }
    }
  };

  const handleStampUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setStampPreview(reader.result);
      };
      reader.readAsDataURL(file);
      const stampFormData = new FormData();
      stampFormData.append("stamp", file);

      try {
        await addOrUpdateStamp(stampFormData);
        toast({
          title: "Stamp",
          description: "Stamp updated successfully",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        // Handle success or error
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
          console.error("Error uploading stamp:", error);
          toast({
            title: "Error",
            description: 'Updation ERROR',
            status: "error",
            duration: 3000,
            position: "top-right",
            isClosable: true,
          });
        }
      }

    }
  };

  const handleLogoButtonClick = () => {
    logoInputRef.current.click();
  };

  const handleStampButtonClick = () => {
    stampInputRef.current.click();
  };

  const handleNameUpdate = async () => {
    const nameData = { name };
    try {
      await addOrUpdateName(nameData);
      toast({
        title: "Name",
        description: "Name updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
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
        console.error("Error uploading Name:", error);
        toast({
          title: "Error",
          description: 'Updation ERROR',
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    }
  };

  const handleAddressUpdate = async () => {
    const addressData = { address };
    try {
      await addOrUpdateAddress(addressData);
      toast({
        title: "Address",
        description: "Address updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
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
        console.error("Error uploading address:", error);
        toast({
          title: "Error",
          description: 'Updation ERROR',
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    }
  };

  const handleVatNumberUpdate = async () => {
    const vatNumberData = { vat_no: vatNumber };
    try {
      await addOrUpdateVatNumber(vatNumberData);
      toast({
        title: "VAT Number",
        description: "VAT Number updated successfully",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
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
        console.error("Error uploading vat number:", error);
        toast({
          title: "Error",
          description: 'Updation ERROR',
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    }
  };
  useEffect(() => {
    // Fetch initial settings
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await getAllSettings();
        if (response.success) {
          const settings = response.settings;
          setLogoPreview(`${BASE_URL}/uploads/logo/${settings.logo_img}`);
          setStampPreview(`${BASE_URL}/uploads/stamp/${settings.stamp_img}`);
          setName(settings.name);
          setAddress(settings.address);
          setVatNumber(settings.vat_no);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []); // Make 

  return (
    <Box bg={bgColor} py={8} minH="100vh">
      <Container maxW="container.xl" mr="0">
        <Heading as="h1" size="xl" mb={4}>
          Admin Settings
        </Heading>
        <FormControl isRequired>
          {isLoading ? ( // Display loader when isLoading is true
            <Center>
              <div class="loader">
                <div class="cover"></div>
              </div>
            </Center>
          ) : (
            <React.Fragment>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Flex direction="column" align="center" rowGap={6} bg={bgColorCard} borderRadius={10} p={5}>
                  <FormLabel>Your Logo</FormLabel>
                  {logoPreview && (
                    <Image src={logoPreview} alt="Logo Preview" maxHeight="5rem" height="auto" />
                  )}
                  <Input
                    ref={logoInputRef}
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={handleLogoButtonClick}
                  >
                    Upload Logo
                  </Button>
                </Flex>
                <Flex direction="column" align="center" rowGap={6} bg={bgColorCard} borderRadius={10} p={5}>
                  <FormLabel>Your Stamp</FormLabel>
                  {stampPreview && (
                    <Image src={stampPreview} alt="Stamp Preview" maxHeight="5rem" height="auto" />
                  )}
                  <Input
                    ref={stampInputRef}
                    id="stamp-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleStampUpload}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={handleStampButtonClick}
                  >
                    Upload Stamp
                  </Button>
                </Flex>
              </SimpleGrid>
              <Divider orientation="horizontal" my={4} />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Stack align="center" justify="space-between" direction={{base:"column", md:"row"}} bg={bgColorCard} borderRadius={10} p={5}>
                  <Box>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Box>
                  <Button variant="solid" colorScheme="blue" onClick={handleNameUpdate}>
                    Update
                  </Button>
                </Stack>
                <Stack align="center" justify="space-between" direction={{base:"column", md:"row"}} bg={bgColorCard} borderRadius={10} p={5}>
                  <Box>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      width={{ base: 300, md: 400 }}
                      name="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Box>
                  <Button variant="solid" colorScheme="blue" onClick={handleAddressUpdate}>
                    Update
                  </Button>
                </Stack>
                <Stack align="center" justify="space-between" direction={{base:"column", md:"row"}} bg={bgColorCard} borderRadius={10} p={5}>
                  <Box>
                    <FormLabel>VAT Number</FormLabel>
                    <Input
                      name="vatNumber"
                      type="text"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                    />
                  </Box>
                  <Button variant="solid" colorScheme="blue" onClick={handleVatNumberUpdate}>
                    Update
                  </Button>
                </Stack>
              </SimpleGrid>
            </React.Fragment>
          )}
        </FormControl>
      </Container>
    </Box>
  );
};

export default AdminSettingsPage;