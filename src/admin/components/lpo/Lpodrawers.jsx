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
import AddNewDrawer from "./LpoaddNewDrawer";
import ShowDrawer from "./LpoShowDrawer";
import EditDrawer from "./LpoeditDrawer";
import RecordPaymentDrawer from "./LpoRecordPaymentDrawer";
import PdfDrawer from "./LpoPdfDrawer";

const LpoDrawers = ({
  isOpen,
  onClose,
  drawerType,
  data,
  onAddNewInvoice,
  handleUpdateInvoice,
}) => {
  const renderDrawer = () => {
    switch (drawerType) {
      case "addNew":
        return (
          <AddNewDrawer
            onAddNewInvoice={onAddNewInvoice}
            handleUpdateInvoice={handleUpdateInvoice}
            onClose={onClose}
          />
        );
      case "show":
        return (
          <ShowDrawer
            data={data}
            onClose={onClose}
            handleUpdateInvoice={handleUpdateInvoice}
          />
        );
      case "edit":
        return (
          <EditDrawer
            data={data} // Assuming you have selectedInvoiceData
            onClose={onClose}
            handleUpdateInvoice={handleUpdateInvoice} // Pass the function here
          />
        );
      case "recordPayment":
        return (
          <RecordPaymentDrawer
            data={data}
            onClose={onClose}
            handleUpdateInvoice={handleUpdateInvoice}
          />
        );
      case "pdf":
        return <PdfDrawer data={data} onClose={onClose} />;
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
          {drawerType === "addNew" && "Add New LPO"}
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

export default LpoDrawers;
