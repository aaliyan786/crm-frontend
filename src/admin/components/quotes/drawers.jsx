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
import AddNewDrawer from "./addNewDrawer";
import ShowDrawer from "./showDrawer";
import EditDrawer from "./editDrawer";
import PdfDrawerQ from "./pdfDrawer";

const Drawers = ({
  isOpen,
  onClose,
  drawerType,
  data,
  handleAddUpdateDeleteQuote
}) => {
  const renderDrawer = () => {
    switch (drawerType) {
      case "addNew":
        return (
          <AddNewDrawer handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote} onClose={onClose} />
        );
      case "show":
        return <ShowDrawer data={data} onClose={onClose} />;
      case "edit":
        return (
          <EditDrawer
            data={data} // Assuming you have selectedInvoiceData
            onClose={onClose}
            handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote} // Pass the function here
          />
        );
      case "pdf":
        return <PdfDrawerQ data={data} onClose={onClose} handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote} />;
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
          {drawerType === "addNew" && "Add New Quote"}
          {drawerType === "show" && "Show Details"}
          {drawerType === "edit" && "Edit Details"}
          {drawerType === "recordPayment" && "Record Payment"}
          {drawerType === "pdf" && "Show PDF"}
        </DrawerHeader>
        <DrawerBody>{renderDrawer()}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Drawers;
