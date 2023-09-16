import React from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import TempShowDrawer from "./TempShowDrawer";
import TempAssignDrawer from "./TempAssignModal";

const TempDrawers = ({
  isOpen,
  onClose,
  drawerType,
  data,
  handleAddUpdateDeleteQuote
}) => {
  const renderDrawer = () => {
    switch (drawerType) {
      
      case "show":
        return <TempShowDrawer data={data} onClose={onClose} />;
      case "assign":
        return (
          <TempAssignDrawer
            data={data} // Assuming you have selectedInvoiceData
            onClose={onClose}
            handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote} // Pass the function here
          />
        );
      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="full" onClose={onClose}>
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
          {drawerType === "show" && "Show Details"}
          {drawerType === "assign" && "Edit Details"}
        </DrawerHeader>
        <DrawerBody>{renderDrawer()}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TempDrawers;
