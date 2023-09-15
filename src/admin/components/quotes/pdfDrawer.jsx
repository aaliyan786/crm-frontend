// PdfDrawerQ.js
import CryptoJS from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Logo from "../../../images/FourSeasonLogoBlack.png";
import StampImg from "../../../images/StampLogo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getInvoicePdfById } from "../../../API/api";
import { getQuotePdfById } from "../../../API/api";
import { updateQuoteData } from "../../../API/api";
import ConfirmationAlert from "../../../components/common/ConfirmationAlert";
import { sendPdfByEmail, BASE_URL } from "../../../API/api";
import QRCode from "qrcode.react";

function addTextWithMaxWidth(doc, title, text, maxWidth, startY, lineHeight) {
  doc.setFont("helvetica", "bold");
  doc.text(title, 15, startY);
  doc.setFont("helvetica", "normal");

  // Split the text into lines that fit within the maxWidth
  const textLines = doc.splitTextToSize(text, maxWidth);

  // Iterate through the lines and add them to the PDF
  textLines.forEach((line, index) => {
    const yPos = startY + 5 + index * lineHeight;
    doc.text(line, 20, yPos);
  });

  // Return the updated Y position for the next section
  return startY + textLines.length * lineHeight + 10; // Adjust spacing as needed
}

const PdfDrawerQ = ({ data, handleAddUpdateDeleteQuote, onClose }) => {
  const [pdfData, setPdfData] = useState(null);
  const [Items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the invoice data when the component mounts
    const fetchQuoteData = async () => {
      console.log("datatatatatat quotes: ", data);
      setIsLoading(true);
      try {
        const pdfData = await getQuotePdfById(data.quotesData.id);
        setPdfData(pdfData);
        console.log("quote items", pdfData.data.quoteItems);
        console.log(Items);
        setItems(pdfData.data.quoteItems);
        console.log("New items", Items);
        console.log("PDF DATA", pdfData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuoteData();
  }, []);
  console.log(Items);
  console.log("pdf", pdfData);
  //  Items = pdfData.data.invoiceItems;
  const pdfRef = useRef();
  const calculateItemsPerPage = (doc, tableStartY) => {
    const availableSpace = doc.internal.pageSize.height - tableStartY;
    const rowHeight = 15; // Assuming a row height of 15 units

    // Calculate how many items can fit in the available space
    const maxItemsPerPage = Math.floor(availableSpace / rowHeight);

    return maxItemsPerPage;
  };
  const toast = useToast();
  const sendPdf = async () => {
    console.log("data.quotesData.status: ", data.quotesData.status);
    if (data.quotesData.status != "ACCEPTED") {
      try {
        const updatedQuoteData = {
          status: 3,
        };
        await updateQuoteData(data.quotesData.id, updatedQuoteData);
        toast({
          title: "Email send",
          description: "Email send to admin for approval.",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        handleAddUpdateDeleteQuote();
        onClose(onClose);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast({
            title: "Error",
            description: error.response.data.error,
            status: "error",
            duration: 3000,
            position: "top-right",
            isClosable: true,
          });
        } else console.error("Error saving Quote:", error);
      }
    } else {
      try {
        // Generate the PDF using CreatePdf function
        const pdf = CreatePdf();

        // Convert the PDF to a Blob
        const pdfBlob = new Blob([pdf.output("blob")], {
          type: "application/pdf",
        });

        // Create a File object from the Blob with a custom filename
        const pdfFile = new File(
          [pdfBlob],
          `Quote ${data.quotesData.number}.pdf`,
          { type: "application/pdf" }
        );
        const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";
        const encryptedData = localStorage.getItem("password");
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedData,
          secretKey
        ).toString(CryptoJS.enc.Utf8);
        // Use the sendPdfByEmail function to send the PDF via the API
        const response = await sendPdfByEmail(
          pdfFile,
          data.quotesData.added_by_employee, // Replace with the appropriate employeeId
          data.quotesData.client_id, // Replace with the appropriate clientId
          decryptedData // Replace with the appropriate employeePassword
        );

        toast({
          title: "Email Send",
          description: "The quote email has been send successfully.",
          status: "success",
          position: "top-right",
          duration: 3000,
          isClosable: true,
        });
        onClose(onClose);
        // Handle the API response (e.g., show a success message)
        console.log("PDF sent successfully:", response);
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast({
            title: "Error",
            description: error.response.data.error,
            position: "top-right",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        // Handle or display the error (e.g., show an error message)
        console.error("Error sending PDF:", error);
      }
    }
  };

  const download = () => {
    const doc = CreatePdf();
    doc.save("Quote" + " " + data.quotesData.number);
  };
  const CreatePdf = () => {
    const doc = new jsPDF();
    const logoURL = `${BASE_URL}/uploads/logo/${pdfData.data.settings.logo_img}`;
    const logoStamp = `${BASE_URL}/uploads/stamp/${pdfData.data.settings.stamp_img}`;
    let base64Image = document.getElementById('qrcode').toDataURL();


    doc.addImage(logoURL, "JPEG", 15, 10, 80, 20);
    // doc.addImage(Logo, "JPEG", 15, 10, 80, 20);
    doc.setFontSize(10);

    // Place "Four Seasons" text below the image, aligned with the left edge
    doc.setFont("helvetica", "bold");
    doc.text(`${pdfData.data.settings.name}`, 15, 40); // X: 15, Y: 85

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    // Place address lines below the "Four Seasons" text, aligned with the left edge
    doc.text(`${pdfData.data.settings.address}`, 15, 45); // X: 15, Y: 95
    doc.text("United Arab Emirates 37613", 15, 50); // X: 15, Y: 105
    doc.text("Vat Number: " + `${pdfData.data.settings.vat_no}`, 15, 55); // X: 15, Y: 115

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(
      "Expiry Date: " + data.quotesData.expiry_date
    ); // Choose the longest text
    const textX = pageWidth - textWidth - 15;
    // doc.setFontSize(14)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("QUOTATION", pageWidth - doc.getTextWidth("QUOTATION") - 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      data.quotesData.number,
      pageWidth - doc.getTextWidth(data.quotesData.number) - 15,
      25
    );
    doc.text(
      data.quotesData.status,
      pageWidth - doc.getTextWidth(data.quotesData.status) - 15,
      30
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("To", pageWidth - doc.getTextWidth("To") - 15, 40);
    doc.text(
      data.quotesData.client_fname + " " + data.quotesData.client_lname,
      pageWidth -
      doc.getTextWidth(
        data.quotesData.client_fname + " " + data.quotesData.client_lname
      ) -
      15,
      45
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      data.quotesData.client_phone,
      pageWidth - doc.getTextWidth(data.quotesData.client_phone) - 15,
      50
    );
    const timestamp = data.quotesData.expiry_date;
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split("T")[0];
    doc.text(
      "Expiry Date: " + formattedDate,
      pageWidth - doc.getTextWidth("Expiry Date: " + formattedDate) - 15,
      55
    );
    doc.text(
      "Sales Agent: " +
      data.quotesData.employee_name +
      " " +
      data.quotesData.employee_surname,
      pageWidth -
      doc.getTextWidth(
        "Sales Agent: " +
        data.quotesData.employee_name +
        " " +
        data.quotesData.employee_surname
      ) -
      15,
      65
    );

    const tableStartY = 70; // Starting Y-coordinate for the table
    const itemsPerPage = calculateItemsPerPage(doc, tableStartY);

    const totalPages = Math.ceil(Items.length / itemsPerPage);

    let lastTableBottomY = tableStartY;

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        doc.addPage();
        lastTableBottomY = tableStartY; // Reset the Y-coordinate for the new page
      }

      const startIdx = page * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const currentPageItems = Items.slice(startIdx, endIdx);

      // Add content to the current page
      doc.setFontSize(12);
      // doc.text(`Invoice Page ${page + 1}`, 15, 15);

      const tableOptions = {
        startY: lastTableBottomY,
        head: [
          [
            { content: "#", styles: { fillColor: [184, 30, 116] } },
            { content: "Item", styles: { fillColor: [184, 30, 116] } },
            { content: "Description", styles: { fillColor: [184, 30, 116] } },
            { content: "Dimension", styles: { fillColor: [184, 30, 116] } },
            { content: "Unit", styles: { fillColor: [184, 30, 116] } },
            { content: "Qty", styles: { fillColor: [184, 30, 116] } },
            { content: "Rate", styles: { fillColor: [184, 30, 116] } },
            { content: "Amount", styles: { fillColor: [184, 30, 116] } },
          ],
        ],
        body: currentPageItems.map((item) => [
          item.id,
          item.item_name,
          item.item_description,
          item.item_xdim + "x" + item.item_ydim,
          "Sqm",
          item.item_quantity,
          item.item_price,
          item.item_total,
        ]),
      };

      const tableHeight = tableOptions.body.length * 15; // Assuming a row height of 15 units

      if (tableHeight > doc.internal.pageSize.height - lastTableBottomY) {
        doc.addPage();
        lastTableBottomY = tableStartY; // Reset the Y-coordinate for the new page
      }

      // Add the table
      doc.autoTable(tableOptions);
      lastTableBottomY = doc.autoTable.previous.finalY;
    }

    const textSpacing = 5;
    doc.setFontSize(8);
    doc.text(
      "Sub Total: AED" + pdfData.data.Summarry.subtotal,
      pageWidth -
      doc.getTextWidth("Sub Total: AED" + pdfData.data.Summarry.subtotal) -
      15,
      lastTableBottomY + textSpacing
    );

    doc.text(
      `Tax (${(pdfData.data.Summarry.tax / pdfData.data.Summarry.subtotal) * 100
      }%): ` + pdfData.data.Summarry.tax,
      pageWidth -
      doc.getTextWidth(
        `Vat (${(pdfData.data.Summarry.tax / pdfData.data.Summarry.subtotal) * 100
        }%): ` + pdfData.data.Summarry.tax
      ) -
      15,
      lastTableBottomY + textSpacing + 5
    );

    // doc.text(
    //   "Adjustment: " +
    //   adjustment,
    //   pageWidth -
    //   doc.getTextWidth(
    //     "Adjustment: " +
    //     adjustment
    //   ) -
    //   15,
    //   lastTableBottomY + textSpacing + 10
    // );

    doc.text(
      "Total: AED" + pdfData.data.Summarry.total,
      pageWidth -
      doc.getTextWidth("Total: AED" + pdfData.data.Summarry.total) -
      15,
      lastTableBottomY + textSpacing + 10
    );
    let startY = lastTableBottomY + textSpacing + 15; // Initial Y position
    const lineHeight = 4; // Adjust this value as needed for line spacing

    const addTextWithPageBreak = (text, maxWidth) => {
      // Add a top margin
      // startY += topMargin;
      const lines = doc.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        doc.text(line, 15, startY);
        startY += lineHeight;
        if (startY >= doc.internal.pageSize.height - 20) {
          doc.addPage();
          startY = 20;
        }
      }
      // Add a line break
      startY += lineHeight;
    };

    addTextWithPageBreak("Note:\n" + pdfData.data.quoteData.note, 175);

    addTextWithPageBreak(
      "Terms & Conditions:\n" + pdfData.data.quoteData.terms_and_condition,
      175
    );

    addTextWithPageBreak(
      "Payment Terms:\n" + pdfData.data.quoteData.payment_terms,
      175
    );

    addTextWithPageBreak(
      "Execution Time:\n" + pdfData.data.quoteData.execution_time,
      175
    );

    addTextWithPageBreak(
      "Bank Account Details:\n" + pdfData.data.quoteData.bank_details,
      175
    );
    doc.text("Authorised Signature", 15, startY + 5); // X: 15, Y: 85
    doc.addImage(logoStamp, "JPEG", 15, startY + 7, 20, 20);
    doc.addImage(base64Image, 'JPEG', 15, startY + 30, 20, 20)


    // Save the complete PDF
    return doc;
  };
  const [isSendEmail, setIsSendEmail] = useState(false);

  const handleAcceptClick = () => {
    // setSelectedQuoteId(quoteId); // Store the ID of the invoice to be deleted
    setIsSendEmail(true); // Open the delete confirmation dialog
  };
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";
  const dataToEncrypt = data.quotesData.id ;
  const encryptedData = CryptoJS.AES.encrypt(
    dataToEncrypt,
    secretKey
  ).toString();
  if (error) {
    // Handle the error gracefully
    return (
      <div>
        <Center>
          <VStack>
            <Text>
              Error loading PDF data, complete the settings first and other
              information!!
            </Text>
            <Link to="/settings">
              <Button variant="solid" colorScheme="blue">
                Continue to settings
              </Button>
            </Link>
          </VStack>
        </Center>
      </div>
    );
  }
  return (
    <div>
      <Flex direction="row" justify="end" id="backToTop">
        <Button
          variant="outline"
          colorScheme="green"
          mr={2}
          onClick={handleAcceptClick}
        >
          Send PDF
        </Button>
        <Button variant="solid" colorScheme="red" onClick={download}>
          Download PDF
        </Button>
      </Flex>
      {isLoading ? (
        // Display CircularProgress (Spinner) while loading
        <Center>
          <div class="loader">
            <div class="cover"></div>
          </div>
        </Center>
      ) : (
        <div ref={pdfRef} style={{ padding: "2rem" }}>
          <SimpleGrid columns={2} justifyContent="space-between">
            <VStack justify="start" align="start">
              {/* <Image src={Logo} width="400px" mb={50} /> */}
              <Image
                src={`${BASE_URL}/uploads/logo/${pdfData.data.settings.logo_img}`}
                width="400px"
                mb={50}
              />
              <Text fontWeight="bold">{pdfData.data.settings.name}</Text>
              <Text>Address: {pdfData.data.settings.address}</Text>
              <Text>VAT Number: {pdfData.data.settings.vat_no}</Text>
            </VStack>
            <VStack align="end">
              <Text fontSize={{ base: 25, md: 40 }} fontWeight="bold" align="end">
                QUOTATION
              </Text>
              <Text fontSize={15}>{data.quotesData.number}</Text>
              <Text
                fontSize={15}
                border="1px black solid"
                borderRadius="md"
                padding={1}
                fontWeight="bold"
              >
                {data.quotesData.status}
              </Text>
              <Text fontWeight="bold">To</Text>
              <Text fontWeight="bold">
                {data.quotesData.client_fname} {data.quotesData.client_lname}
              </Text>
              <Text>{data.quotesData.client_phone}</Text>
              <Text>{data.quotesData.client_address} </Text>
              <Text>{data.quotesData.client_vat} </Text>
              <Divider orientation="horizontal" height={10} />
              <Text>Expiry Date: {data.quotesData.expiry_date}</Text>
              <Text>
                Sales Agent: {data.quotesData.employee_name}{" "}
                {data.quotesData.employee_surname}
              </Text>
              <Text>{data.quotesData.employee_email}</Text>
            </VStack>
          </SimpleGrid>
          <Divider orientation="horizontal" height={10} />

          <TableContainer>
            <Table>
              <Thead>
                <Tr bg="#b81e74">
                  <Th color="white">#</Th>
                  <Th color="white">Item</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Dimension</Th>
                  <Th color="white">Unit</Th>
                  <Th color="white">Qty</Th>
                  <Th color="white">Rate</Th>
                  <Th color="white">Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Items.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.item_name}</Td>
                    <Td>{item.item_description}</Td>
                    <Td>{item.item_xdim + "x" + item.item_ydim}</Td>
                    <Td>{"Sqm"}</Td>
                    <Td>{item.item_quantity}</Td>
                    <Td>{item.item_price}</Td>
                    <Td>{item.item_total}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Divider orientation="horizontal" height={10} />
          <VStack align="end">
            <SimpleGrid columns={2} spacing={10}>
              <VStack align="start">
                <Text align="start" fontWeight="bold" flex="1">
                  Sub Total
                </Text>
                <Text align="start" fontWeight="bold" flex="1">
                  Tax (
                  {(pdfData.data.Summarry.tax /
                    pdfData.data.Summarry.subtotal) *
                    100}
                  )%
                </Text>
                {/* <Text align="start" fontWeight="bold" flex="1">
                Adjustment
              </Text> */}
                <Text align="start" fontWeight="bold" flex="1">
                  Total
                </Text>
              </VStack>
              <VStack align="start">
                <Text align="end">AED {pdfData.data.Summarry.subtotal}</Text>
                <Text align="end">AED {pdfData.data.Summarry.tax}</Text>
                {/* <Text align="end">AED {adjustment}</Text> */}
                <Text align="end">AED {pdfData.data.Summarry.total}</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
          <VStack align="start">
            <Text fontWeight="bold">Note:</Text>
            <Text>{pdfData.data.quoteData.note}</Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Terms & Conditions:</Text>
            <Text>{pdfData.data.quoteData.terms_and_condition}</Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Payment Terms:</Text>
            <Text>{pdfData.data.quoteData.payment_terms}</Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Execution Time:</Text>
            <Text>{pdfData.data.quoteData.execution_time}</Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Bank Account Details:</Text>
            <Text>{pdfData.data.quoteData.bank_details}</Text>
            <Divider orientation="horizontal" height={10} />
          </VStack>
          <Divider orientation="horizontal" height={10} />
          <Text>Authorised Signature</Text>
          <Image
            src={`${BASE_URL}/uploads/stamp/${pdfData.data.settings.stamp_img}`}
            width="200px"
            mb={50}
          />
          <QRCode value={`${BASE_URL}/quoteapproval/${encryptedData}`} id='qrcode' />

        </div>
      )}
      <ConfirmationAlert
        isOpen={isSendEmail}
        onClose={() => setIsSendEmail(false)}
        onConfirm={sendPdf}
        HeaderText={"Send Email"}
        BodyText={
          "Are you sure you want to send this qoute to client? this action is not reversible, this qoute is send to admin for approval"
        }
        confirmButtonColorScheme="green" // Customize button color for accepting
        confirmButtonText="Accept" // Customize the text for the confirm button
        cancelButtonText="Cancel" // Customize the text for the cancel button
      />
    </div>
  );
};

export default PdfDrawerQ;
