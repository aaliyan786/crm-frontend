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
import AssignedShowDrawer from "./AssignedShowDrawer";

const AssignedDrawers = ({
  isOpen,
  onClose,
  drawerType,
  data,
  handleAddUpdateDeleteQuote
}) => {
  const renderDrawer = () => {
    switch (drawerType) {
      case "show":
        return <AssignedShowDrawer data={data} onClose={onClose} />;
      // case "edit":
      //   return (
      //     <LossEditDrawer
      //       data={data} // Assuming you have selectedInvoiceData
      //       onClose={onClose}
      //       handleAddUpdateDeleteQuote={handleAddUpdateDeleteQuote} // Pass the function here
      //     />
      //   );
    //   case "recordPayment":
    //     return (
    //       <RecordPaymentDrawer
    //         data={data}
    //         onClose={onClose}
    //         handleUpdateInvoice={handleUpdateQuote}
    //       />
    //     );
      // case "pdf":
      //   return <PdfDrawer data={data} onClose={onClose} />;
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
          {/* {drawerType === "addNew" && "Add New Quote"} */}
          {drawerType === "show" && "Show Details"}
          {/* {drawerType === "edit" && "Edit Details"} */}
          {/* {drawerType === "recordPayment" && "Record Payment"}
          {drawerType === "pdf" && "Show PDF"} */}
        </DrawerHeader>
        <DrawerBody>{renderDrawer()}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AssignedDrawers;
