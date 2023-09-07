import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  CloseButton,
  Button,
} from "@chakra-ui/react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import AddNewDrawerE from "./addNewDrawerE";
import EditDrawerE from "./editDrawerE";
import SendMessageE from "./sendMessageE";
import ShowDrawerE from "./showDrawerE";

const DrawersE = ({
  isOpen,
  onClose,
  drawerType,
  data,
  handleAddOrUpdateEmployee,
}) => {
  const renderDrawer = () => {
    switch (drawerType) {
      case "addNew":
        return (
          <AddNewDrawerE
            handleAddOrUpdateEmployee={handleAddOrUpdateEmployee}
            onClose={onClose}
          />
        );
      case "show":
        return <ShowDrawerE data={data} onClose={onClose}/>;
      case "edit":
        return (
          <EditDrawerE
            data={data}
            handleAddOrUpdateEmployee={handleAddOrUpdateEmployee}
            onClose={onClose}
          />
        );
      case "message":
        return <SendMessageE data={data} onClose={onClose}/>;
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
          {drawerType === "addNew" && "Add New Employee"}
          {drawerType === "show" && "Show Details"}
          {drawerType === "edit" && "Edit Details"}
          {drawerType === "message" && "Send Message"}
        </DrawerHeader>
        <DrawerBody>{renderDrawer()}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawersE;
