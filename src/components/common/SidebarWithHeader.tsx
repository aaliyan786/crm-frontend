"use client";
import { Link, useLocation } from "react-router-dom";
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import CryptoJS from "crypto-js";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Image,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Badge,
  PopoverFooter,
  extendTheme,
  ChakraProvider,
} from "@chakra-ui/react";

import {
  FiHome,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiUsers,
  FiFileText,
  FiFile,
  FiCreditCard,
  FiFileMinus,
  FiFilePlus,
} from "react-icons/fi";

import { getAnnouncementByEmployee } from "../../API/api";
import { IconType } from "react-icons";
import { DeleteIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const logoDark = require("../../images/FourSeasonLogoBlack.png");
const logoLight = require("../../images/FourSeasonLogoWhite.png");
// interface LinkItemProps {
//   name: string;
//   icon: IconType;
//   to: string;
// }

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  to: string;
}
interface Announcement {
  id: number;
  title: string;
  priority: number;
  description: string;
}
interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
function handleLogout() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "/";
}

const encryptedData = localStorage.getItem("encryptedData");
const Name = localStorage.getItem("Name");
const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA"; // Replace with your own secret key

let department = ""; // Initialize the department variable

if (encryptedData) {
  try {
    // Decrypt the data
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedData) {
      // Data successfully decrypted, assign it to the department variable
      department = decryptedData;
    } else {
      // Handle the case where decryption resulted in empty data
      console.error("Decryption resulted in empty data");
    }
  } catch (error) {
    // Handle decryption errors
    console.error("Decryption error:", error);
  }
} else {
  // Handle the case where 'encryptedData' is not found in local storage
  console.error("Item not found in local storage");
}

let linkItems = [
  { name: "Dashboard", icon: FiHome, to: "/dashboard" },
  { name: "Customer", icon: FiUsers, to: "/customers" },
  { name: "Invoice", icon: FiFileText, to: "/invoices" },
  { name: "Quote", icon: FiFile, to: "/quotes" },
  { name: "Lost Quotes", icon: FiFileMinus, to: "/lossquotes" },
  { name: "Quote Approval", icon: FiFileMinus, to: "/acceptedquotes" },
  { name: "Assigned Quotes", icon: FiFilePlus, to: "/assignedquotes" },
  { name: "Employee", icon: FiUser, to: "/employees" },
  { name: "Settings", icon: FiSettings, to: "/settings" },
  { name: "Payment Mode", icon: FiCreditCard, to: "/settings/paymentmodes" },
];

// Filter link items based on the department
if (department === "admin") {
  // Include all items for admin
  linkItems = linkItems.filter(
    (item) =>
      item.name === "Dashboard" ||
      item.name === "Customer" ||
      item.name === "Invoice" ||
      item.name === "Quote" ||
      item.name === "Lost Quotes" ||
      item.name === "Quote Approval" ||
      item.name === "Employee" ||
      item.name === "Settings" ||
      item.name === "Payment Mode"

  )
} else if (department === "sales") {
  // Include only specific items for sales
  linkItems = linkItems.filter(
    (item) =>
      item.name === "Dashboard" ||
      item.name === "Customer" ||
      item.name === "Quote" ||
      item.name === "Assigned Quotes"
  );
} else if (department === "accounts") {
  // Include only specific items for accounts
  linkItems = linkItems.filter(
    (item) =>
      item.name === "Dashboard" ||
      item.name === "Customer" ||
      item.name === "Invoice"
  );
}


const customTheme = extendTheme({
  breakpoints: {
    sm: "320px", // Adjust this value to your desired breakpoint
    md: "1520px", // Set a smaller value here for the new breakpoint
    lg: "1520px",
    xl: "1200px",
  },
  // Other theme configurations...
});
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode();
  return (
    <ChakraProvider theme={customTheme}>
      <Box
        transition="3s ease"
        bg={useColorModeValue("white", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <img src={colorMode === "light" ? logoDark : logoLight} alt="logo" />
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>
        {linkItems.map((link) => (
          <Link to={link.to} key={link.name}>
            <NavItem icon={link.icon} to={link.to} onClick={onClose}>
              {link.name}
            </NavItem>
          </Link>
        ))}
      </Box>
    </ChakraProvider>
  );
};

const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
  const location = useLocation(); // Get the current location

  // Determine if the current link matches the current route
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Box
        as="a"
        href={to}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          // Apply active styles if isActive is true
          bg={isActive ? "cyan.400" : "transparent"}
          color={isActive ? "white" : "inherit"}
          _focus={{
            bg: "cyan.400",
            color: "white",
          }}
          _active={{
            bg: "cyan.400",
            color: "white",
          }}
          _hover={{
            bg: "cyan.400",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgAnnouncement = useColorModeValue("white", "gray.800");
  const borderAnnouncement = useColorModeValue("lightgrey", "gray.500");
  // const color = useColorModeValue("gray.800", "white");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Provide type information

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await getAnnouncementByEmployee();
        console.log("first")
        setAnnouncements(response.announcements);
      } catch (error) {
        console.error("Error fetching Announcements:", error);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <Flex
      ml={{ base: 0, md: "full" }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.900")}
      justifyContent={{ base: "space-between",md:"space-between", lg:"space-between" , xl: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "flex", lg:"flex", xl:"none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        <Image
          ml={10}
          width="12rem"
          src={colorMode === "light" ? logoDark : logoLight}
          alt="logo"
        />
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          style={
            colorMode === "light"
              ? { backgroundColor: "#fff" }
              : { backgroundColor: "#fff0" }
          }
        />
        {department === "admin" ? null : (
          <Popover>
            <PopoverTrigger>
              <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<FiBell />}
              />
            </PopoverTrigger>
            <PopoverContent boxSize="lg">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader textAlign="center">Announcements</PopoverHeader>
              <PopoverBody maxH="400px" overflowY="scroll">
                {announcements.map((announcement) => (
                  <Box
                    key={announcement.id}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={2}
                    mt={4}
                  >
                    <HStack justify="space-between">
                      <Text
                        borderRadius="sm"
                        p={2}
                        align="center"
                        fontWeight="bold"
                        fontSize="lg"
                        textTransform="uppercase"
                      >
                        {announcement.title}
                      </Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        aria-label={`Delete ${announcement.title}`}
                      />
                    </HStack>

                    <Badge colorScheme="yellow" variant="subtle">
                      Priority: {announcement.priority}
                    </Badge>
                    <Text>{announcement.description}</Text>
                  </Box>
                ))}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}

        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>

                <Avatar
                  size={"md"}
                  name={Name || ""}
                  bg={useColorModeValue("gray.200", "gray.600")}
                  color={useColorModeValue("black", "white")}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{Name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {department}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.800")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {department === "admin" && (
                <MenuItem as={Link} to="/settings">
                  Settings
                </MenuItem>
              )}

              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
