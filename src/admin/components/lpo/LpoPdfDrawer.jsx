// LpoPdfDrawer.js
import CryptoJS from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getInvoicePdfById } from "../../../API/api";
import { sendPdfByEmail, BASE_URL } from "../../../API/api";
import ConfirmationAlert from "../../../components/common/ConfirmationAlert";
import { Link } from "react-router-dom";

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

const LpoPdfDrawer = ({ data, onClose }) => {
  const [pdfData, setPdfData] = useState(null);
  const [Items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setIsLoading(true);
      try {
        const pdfData = await getInvoicePdfById(data.InvoiceData.id);
        setPdfData(pdfData);
        setItems(pdfData.data.invoiceItems);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoiceData();
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
  const download = () => {
    const doc = CreatePdf();
    doc.save(data.InvoiceData.isPerforma + " " + data.InvoiceData.number);
  };
  const CreatePdf = () => {
    const doc = new jsPDF();
    const logoURL = `${BASE_URL}/uploads/logo/${pdfData.data.settings.logo_img}`;
    const logoStamp = `${BASE_URL}/uploads/stamp/${pdfData.data.settings.stamp_img}`;

    doc.addImage(logoURL, "JPEG", 15, 10, 80, 20);
    doc.setFontSize(10);

    // Place "Four Seasons" text below the image, aligned with the left edge
    // doc.setFont("helvetica", "bold");
    doc.setFont("helvetica", "bold");
    doc.text("From", 15, 40); // X: 15, Y: 85
    doc.setFont("helvetica", "normal");
    doc.text(`${pdfData.data.employee.fname} ${pdfData.data.employee.lname}`, 15, 45); // X: 15, Y: 85
    doc.text("Tel No: " + `hardcoded number`, 15, 50); // X: 15, Y: 85
    doc.text("Address: " + `${pdfData.data.settings.address}`, 15, 55); // X: 15, Y: 85

    doc.setFont("helvetica", "bold");
    doc.text("To", 15, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.InvoiceData.client_fname + " " + data.InvoiceData.client_lname}`, 15, 70); // X: 15, Y: 85
    doc.text("Tel No: " + `${data.InvoiceData.client_phone}`, 15, 75); // X: 15, Y: 85
    doc.text("Email: " + `${data.InvoiceData.client_email}`, 15, 80); // X: 15, Y: 85
    doc.text("Address: " + `${data.InvoiceData.client_address}`, 15, 85); // X: 15, Y: 85
    doc.setFont("helvetica", "bold");
    // doc.text("ATTN: " + "yahan pr naam ayega", 15, 90); // X: 15, Y: 85

    // doc.setFontSize(8);
    // Place address lines below the "Four Seasons" text, aligned with the left edge
    // doc.text(`${pdfData.data.settings.address}`, 15, 40); // X: 15, Y: 95
    // doc.text("United Arab Emirates 37613", 15, 50); // X: 15, Y: 105
    // doc.text("Vat Number: " + `${pdfData.data.settings.vat_no}`, 15, 45); // X: 15, Y: 115

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(
      "Expiry Date: " + data.InvoiceData.expiry_date
    ); // Choose the longest text
    const textX = pageWidth - textWidth - 15;
    // doc.setFontSize(14)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(
      "Purchase Order",
      pageWidth - doc.getTextWidth("Purchase Order") - 15,
      20
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      "DELIVERY LOCATION: " + `${data.InvoiceData.location}`,
      pageWidth -
      doc.getTextWidth(
        "DELIVERY LOCATION: " + `${data.InvoiceData.location}`
      ) -
      15,
      40
    );
    doc.text(
      "PROJECT NAME: " + `${data.InvoiceData.pname}`,
      pageWidth - doc.getTextWidth("PROJECT NAME: " + `${data.InvoiceData.pname}`) - 15,
      45
    );
    doc.text(
      "Contact Person: " + `${data.InvoiceData.employee_name} ${data.InvoiceData.employee_surname}`,
      pageWidth - doc.getTextWidth("Contact Person: " + `${data.InvoiceData.employee_name} ${data.InvoiceData.employee_surname}`) - 15,
      50
    );
    doc.text(
      "Tel No: " + `${data.InvoiceData.employee_phone}`,
      pageWidth - doc.getTextWidth("Tel No: " + `${data.InvoiceData.employee_phone}`) - 15,
      55
    );

    doc.setFont("helvetica", "bold");
    doc.text("L.P.O DATE",50,105)
    doc.text("L.P.O NO",140,105)

    doc.setFont("helvetica", "normal");
    doc.text("15-Aug-23",50,110)
    doc.text("FSGR-PO-138",135,110)
    const tableStartY = 120; // Starting Y-coordinate for the table
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
      "Sub Total: AED " + pdfData.data.Summarry.subtotal,
      pageWidth -
      doc.getTextWidth("Sub Total: AED " + pdfData.data.Summarry.subtotal) -
      15,
      lastTableBottomY + textSpacing
    );

    doc.text(
      `Tax (${((pdfData.data.Summarry.tax / pdfData.data.Summarry.subtotal) * 100).toFixed(2)}%): AED ${pdfData.data.Summarry.tax.toFixed(2)}`,
      pageWidth -
      doc.getTextWidth(
        `Vat (${((pdfData.data.Summarry.tax / pdfData.data.Summarry.subtotal) * 100).toFixed(2)}%): AED ${pdfData.data.Summarry.tax.toFixed(2)}`
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
      "Discount: AED " + pdfData.data.invoiceData.discount,
      pageWidth -
      doc.getTextWidth("Discount: AED " + pdfData.data.invoiceData.discount) -
      15,
      lastTableBottomY + textSpacing + 10
    );
    doc.text(
      "Total: AED " +
      (pdfData.data.Summarry.total - pdfData.data.invoiceData.discount).toFixed(2),
      pageWidth -
      doc.getTextWidth(
        "Total: AED " +
        (pdfData.data.Summarry.total - pdfData.data.invoiceData.discount).toFixed(2)
      ) -
      15,
      lastTableBottomY + textSpacing + 15
    );
    let startY = lastTableBottomY + textSpacing + 20; // Initial Y position
    const lineHeight = 4; // Adjust this value as needed for line spacing
    const topMargin = 10;
    // Function to add text with dynamic page breaks and a line break
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

    addTextWithPageBreak("Note:\n" + pdfData.data.invoiceData.note, 175);

    addTextWithPageBreak(
      "Terms & Conditions:\n" + pdfData.data.invoiceData.terms_and_condition,
      175
    );

    addTextWithPageBreak(
      "Payment Terms:\n" + pdfData.data.invoiceData.payment_terms,
      175
    );

    addTextWithPageBreak(
      "Execution Time:\n" + pdfData.data.invoiceData.execution_time,
      175
    );

    addTextWithPageBreak(
      "Warranties:\n" + pdfData.data.invoiceData.bank_details,
      175
    );
    doc.text("Authorised Signature", 15, startY + 5); // X: 15, Y: 85
    doc.addImage(logoStamp, "JPEG", 15, startY + 7, 20, 20);

    // Save the complete PDF
    return doc;
    // doc.save(data.InvoiceData.isPerforma + " " + data.InvoiceData.number);
  };

  const toast = useToast();
  const sendPdf = async () => {
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
        `${data.InvoiceData.isPerforma} ${data.InvoiceData.number}.pdf`,
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
        data.InvoiceData.added_by_employee, // Replace with the appropriate employeeId
        data.InvoiceData.client_id, // Replace with the appropriate clientId
        decryptedData // Replace with the appropriate employeePassword
      );

      toast({
        title: "Email Send",
        description: "The invoice email has been send successfully.",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      onClose(onClose);
      // Handle the API response (e.g., show a success message)
      console.log("PDF sent successfully:", response);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
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
  };
  const [isSendEmail, setIsSendEmail] = useState(false);

  const handleAcceptClick = () => {
    // setSelectedQuoteId(quoteId); // Store the ID of the invoice to be deleted
    setIsSendEmail(true); // Open the delete confirmation dialog
  };
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
              <Button variant="solid" colorScheme="blue">Continue to settings</Button>
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
              <Image
                src={`${BASE_URL}/uploads/logo/${pdfData.data.settings.logo_img}`}
                width="400px"
                mb={50}
              />
              {/* <Image src={Logo} width="400px" mb={50} /> */}
              <Text fontWeight="bold">From:</Text>
              <Text >{pdfData.data.settings.name}</Text>
              <Text >Tel No: hard coded number</Text>
              <Text>Address: {pdfData.data.settings.address}</Text>
              {/* <Text>Email: <a href="mailto:info@fourseason.ae" >info@fourseason.ae</a></Text> */}
              <Text fontWeight="bold">To:</Text>
              <Text>{data.InvoiceData.client_fname} {data.InvoiceData.client_lname}</Text>
              <Text>Tel No: {data.InvoiceData.client_phone}</Text>
              <Text>Email: {data.InvoiceData.client_email}</Text>
              <Text>Address: {data.InvoiceData.client_address}</Text>
            </VStack>
            <VStack align="end">
              <Text
                fontSize={{ base: 25, md: 40 }}
                fontWeight="bold"
                align="end"
              >
                Purchase Order
              </Text>
              {/* <Divider h={5} */}
              <Text fontSize="lg" mt="100px">DELIVERY LOCATION: {data.InvoiceData.location}</Text>
              <Text fontSize="lg">PROJECT NAME: {data.InvoiceData.pname}</Text>
              <Text>
                Contact Person: {pdfData.data.employee.fname} {pdfData.data.employee.lname}
              </Text>
              <Text>Tel No: {data.InvoiceData.employee_phone}</Text>
            </VStack>
          </SimpleGrid>
          <Divider orientation="horizontal" height={10} />


          <SimpleGrid columns={2} spacing={4}>
            <VStack>
              <Text fontWeight="bold">L.P.O DATE</Text>
              <Text >{new Date(data.InvoiceData.invoice_current_date).toISOString().split("T")[0]}</Text>
            </VStack>
            <VStack>
              <Text fontWeight="bold">L.P.O NO</Text>
              <Text>{data.InvoiceData.number}</Text>
            </VStack>
          </SimpleGrid>
          <TableContainer mt={4}>
            <Table>
              <Thead>
                <Tr bg="#b81e74">
                  <Th color="white">#</Th>
                  <Th color="white">Item</Th>
                  <Th color="white">Description</Th>
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
                    <Td style={{ whiteSpace: "normal" }}>
                      <VStack align="start">
                        {/* <Text fontWeight="bold">{item.item_name}</Text> */}
                        <Text>{item.item_description}</Text>
                      </VStack>
                    </Td>
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
                  {((pdfData.data.Summarry.tax /
                    pdfData.data.Summarry.subtotal) *
                    100).toFixed(2)}
                  )%
                </Text>
                {/* <Text align="start" fontWeight="bold" flex="1">
                Adjustment
              </Text> */}
                <Text align="start" fontWeight="bold" flex="1">
                  Discount
                </Text>
                <Text align="start" fontWeight="bold" flex="1">
                  Total
                </Text>
              </VStack>
              <VStack align="start">
                <Text align="end">AED {pdfData.data.Summarry.subtotal}</Text>
                <Text align="end">AED {pdfData.data.Summarry.tax.toFixed(2)}</Text>
                {/* <Text align="end">AED {adjustment}</Text> */}
                <Text align="end">
                  AED {pdfData.data.invoiceData?.discount}
                </Text>
                <Text align="end">
                  AED{" "}
                  {pdfData.data.Summarry.total -
                    pdfData.data.invoiceData?.discount}
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
          <VStack align="start">
            <Text fontWeight="bold">Note:</Text>
            <Text whiteSpace="pre-line">{pdfData.data.invoiceData.note}</Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Terms & Conditions:</Text>
            <Text whiteSpace="pre-line">
              {pdfData.data.invoiceData.terms_and_condition}
            </Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Payment Terms:</Text>
            <Text whiteSpace="pre-line">
              {pdfData.data.invoiceData.payment_terms}
            </Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Execution Time:</Text>
            <Text whiteSpace="pre-line">
              {pdfData.data.invoiceData.execution_time}
            </Text>
            <Divider orientation="horizontal" height={10} />

            <Text fontWeight="bold">Warranties:</Text>
            <Text whiteSpace="pre-line">
              {pdfData.data.invoiceData.bank_details}
            </Text>
            <Divider orientation="horizontal" height={10} />
          </VStack>

          <Divider orientation="horizontal" height={10} />
          <Text>Authorised Signature</Text>
          <Image
            src={`${BASE_URL}/uploads/stamp/${pdfData.data.settings.stamp_img}`}
            width="200px"
            mb={50}
          />
          {/* <HStack>
            <Image
              src={`${BASE_URL}/uploads/stamp/${pdfData.data.settings.stamp_img}`}
              width="400px"
              mb={50}
            />
          </HStack> */}
        </div>
      )}
      <ConfirmationAlert
        isOpen={isSendEmail}
        onClose={() => setIsSendEmail(false)}
        onConfirm={sendPdf}
        HeaderText={"Send Email"}
        BodyText={
          "Are you sure you want to send this invoice to client? this action is not reversible"
        }
        confirmButtonColorScheme="green" // Customize button color for accepting
        confirmButtonText="Accept" // Customize the text for the confirm button
        cancelButtonText="Cancel" // Customize the text for the cancel button
      />
    </div>
  );
};

export default LpoPdfDrawer;