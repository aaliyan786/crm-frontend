import React, { useState } from "react";
import CryptoJS from "crypto-js";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  Image,
  InputRightElement,
  IconButton,
  InputGroup,
  useToast,
} from "@chakra-ui/react";

// Assets
import signInImage from "./signInImage.png";
import LogoWhite from "../../images/FourSeasonLogoWhite.png";
import LogoBlack from "../../images/FourSeasonLogoBlack.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Custom Components
// import AuthFooter from "components/Footer/AuthFooter";
import GradientBorder from "./GradientBorder";
import { loginUser } from "../../API/api";

function SignIn() {
  const titleColor = useColorModeValue("black", "white");
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toast = useToast();
  function handleSubmit(event) {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    loginUser(credentials)
      .then((data) => {
        // Assuming the API response contains a user object with an authToken field
        const { user } = data;

        // Check if the user object contains an authToken
        if (user && user.authToken) {
          const { authToken } = user;
          const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";
          const dataToEncryptP = password;

          const dataToEncrypt = user.department;
          const encryptedData = CryptoJS.AES.encrypt(
            dataToEncrypt,
            secretKey
          ).toString();
          const encryptedDataP = CryptoJS.AES.encrypt(
            dataToEncryptP,
            secretKey
          ).toString();
          localStorage.setItem("encryptedData", encryptedData);
          localStorage.setItem("password", encryptedDataP);
          localStorage.setItem("email", email);
          // Set the authToken (token) in localStorage
          localStorage.setItem("token", authToken);
          localStorage.setItem("Name", user.name);
          localStorage.setItem("isUserLoggedIn", "true");
          // Set the user data in sessionStorage
          sessionStorage.setItem("user", JSON.stringify(user));

          // Handle any other actions upon successful login
          // For example, you can redirect the user to a different page
          // or update the UI to reflect the logged-in state
          console.log("Login successful. Token set in localStorage.");
          window.location.href = "/";
        } else {
          // Handle the case where no authToken is found (e.g., show an error message)
          console.error("Login failed. No authToken found in the user object.");
        }
      })
      .catch((error) => {
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
            position: "top-right",
            duration: 3000,
            isClosable: true,
          });
        }
        
        // Handle errors (e.g., display an error message)
        console.error("Login error:", error);
      });
  }

  return (
    <Flex position="relative" bg={bgColor}>
      <Flex
        minH="max-content"
        h={{ base: "120vh", lg: "fit-content" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        pt={{ sm: "100px", md: "0px" }}
        flexDirection="column"
        me={{ base: "auto", lg: "50px", xl: "auto" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          mx={{ base: "auto", lg: "unset" }}
          ms={{ base: "auto", lg: "auto" }}
          w={{ base: "100%", md: "50%", lg: "450px" }}
          px="50px"
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            mt={{ base: "50px", md: "150px", lg: "160px", xl: "245px" }}
            mb={{ base: "60px", lg: "95px" }}
          >
            <Image
              mb={10}
              src={bgColor === "gray.100" ? LogoBlack : LogoWhite}
            />
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Nice to see you!
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Enter your email and password to sign in
            </Text>
            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
                color={textColor}
              >
                Email
              </FormLabel>
              <GradientBorder
                mb="24px"
                w={{ base: "100%", lg: "fit-content" }}
                borderRadius="20px"
              >
                <Input
                  color={textColor}
                  bg={bgColor}
                  border="transparent"
                  borderRadius="20px"
                  fontSize="sm"
                  size="lg"
                  w={{ base: "100%", md: "346px" }}
                  maxW="100%"
                  h="46px"
                  placeholder="Your email address"
                  value={email} // Bind the value to the email state variable
                  onChange={(e) => setEmail(e.target.value)}
                />
              </GradientBorder>
            </FormControl>
            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
                // Set your textColor here
                color={textColor}
              >
                Password
              </FormLabel>
              <GradientBorder
                mb="24px"
                w={{ base: "100%", lg: "fit-content" }}
                borderRadius="20px"
              >
                <InputGroup>
                  <Input
                    // Set your textColor and bgColor here
                    color={textColor}
                    bg={bgColor}
                    border="transparent"
                    borderRadius="20px"
                    fontSize="sm"
                    size="lg"
                    w={{ base: "100%", md: "346px" }}
                    maxW="100%"
                    h="46px"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      size="md"
                      bg={bgColor}
                      onClick={handleTogglePassword}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    />
                  </InputRightElement>
                </InputGroup>
              </GradientBorder>
            </FormControl>
            {/* <FormControl display='flex' alignItems='center'>
              <DarkMode>
                <Switch id='remember-login' colorScheme='brand' me='10px' />
              </DarkMode>
              <FormLabel
                htmlFor='remember-login'
                mb='0'
                ms='1'
                fontWeight='normal'
                color='white'>
                Remember me
              </FormLabel>
            </FormControl> */}
            <Button
              variant="solid"
              colorScheme="blue"
              fontSize="md"
              type="submit"
              w="100%"
              maxW="350px"
              h="45"
              mb="20px"
              mt="20px"
              onClick={handleSubmit}
            >
              SIGN IN
            </Button>
          </Flex>
        </Flex>
        {/* <Box
          w={{ base: "335px", md: "450px" }}
          mx={{ base: "auto", lg: "unset" }}
          ms={{ base: "auto", lg: "auto" }}
          mb='80px'>
          <AuthFooter />
        </Box> */}
        <Box
          display={{ base: "none", lg: "block" }}
          overflowX="hidden"
          h="100%"
          maxW={{ md: "50vw", lg: "50vw" }}
          minH="100vh"
          w="960px"
          position="absolute"
          left="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              textAlign="center"
              color="transparent"
              letterSpacing="8px"
              fontSize="36px"
              fontWeight="bold"
              bgClip="text !important"
              bg="linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)"
            >
              FOUR SEASON CRM
            </Text>
            <Text
              mt={10}
              textAlign="center"
              color="white"
              letterSpacing="8px"
              fontSize="14px"
              fontWeight="500"
            >
              {/* DESIGNED & DEVELOPED BY{" "}
                            <a href="https://www.cognisoftlabs.com" target="_blank" rel="noopener noreferrer">COGNISOFT LABS</a> */}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
