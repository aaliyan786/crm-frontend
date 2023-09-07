import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ViewPaymentMode from "./ViewPaymentMode";
import EditPaymentMode from "./EditPaymentMode";
import AddNewPaymentModeDrawer from "./AddNewPaymentModeDrawer";
import { ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
import { BiPlus } from "react-icons/bi";

function DrawersPayM({
  isOpen,
  onClose,
  drawerType,
  data,

  handleAddOrUpdatepaymentMode,
  handleOptionClick, // Include this prop
  selectedDrawerType, // Include this prop
}) {
  const [activeDrawerType, setActiveDrawerType] = useState(null); // Add this state

  const renderDrawer = (type) => {
    switch (
      type // Use the provided type parameter
    ) {
      case "addNew":
        return (
          <AddNewPaymentModeDrawer
            handleAddOrUpdatepaymentMode={handleAddOrUpdatepaymentMode}
            onClose={onClose}
          />
        );
      case "show":
        return <ViewPaymentMode data={data} onClose={onClose} />;
      case "edit":
        return (
          <EditPaymentMode
            data={data}
            onClose={onClose}
            handleAddOrUpdatepaymentMode={handleAddOrUpdatepaymentMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
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
          {drawerType === "addNew" && "Add New Payment Mode"}
          {drawerType === "show" && "Show PaymentMode"}
          {drawerType === "edit" && "Edit Payment Mode"}
        </DrawerHeader>
        <DrawerBody>
          <SimpleGrid columns={2} spacing={4}>
            <InputGroup w="100%">
              {" "}
              {/* Set the desired width for the search input */}
              <Input type="text" placeholder="Search payment modes." />
              <InputRightElement>
                <Search2Icon bg="transparent" />
              </InputRightElement>
            </InputGroup>
            {drawerType !== "addNew" && ( // Fixed the conditional rendering
              <IconButton
                icon={<BiPlus />}
                w="10%"
                onClick={() => handleOptionClick("addNew", null)}
              />
            )}
          </SimpleGrid>
          {selectedDrawerType !== null && renderDrawer(selectedDrawerType)}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawersPayM;
