import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { sendPdfByEmail, BASE_URL } from "../../../API/api";
import ConfirmationAlert from "../../../components/common/ConfirmationAlert";
import { getQuotePdfById } from "../../../API/api";
import NotFoundPage from "../../pages/NotFoundPage";
import CryptoJS from "crypto-js";
import { updateQuoteApprovalStatus } from "../../../API/api";

const QuoteApproval = () => {
  const [pdfData, setPdfData] = useState(null);
  const [Items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pdfid } = useParams();
  const encryptedData = pdfid;
  const secretKey = "sT#9yX^pQ&$mK!2wF@8zL7vA";
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  const toast = useToast();
  useEffect(() => {
    const fetchQuoteData = async () => {
      setIsLoading(true);
      try {
        const pdfData = await getQuotePdfById(parseInt(decryptedData));
        setPdfData(pdfData);
        setItems(pdfData.data.quoteItems);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuoteData();
  }, [pdfid]);

  if (error) {
    return <NotFoundPage />;
  }

  const handleApproveQuote = async () => {
    try {
      await updateQuoteApprovalStatus(pdfData.data.quoteData?.id); // Pass the quote ID as an argument
      toast({
        title: "Quote Approved",
        description: "The Quote has been approved successfully.",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error approving quote",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        console.error("Error approving quote:", error);
      }
    }
  };

  return (
    <Box pt={5}>
      <Flex direction="row" justify="center" id="backToTop">
        <Button variant="solid" colorScheme="green" mr={2} size="lg" onClick={handleApproveQuote}>
          Accept
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
        <div style={{ padding: "2rem" }}>
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
              <Text
                fontSize={{ base: 25, md: 40 }}
                fontWeight="bold"
                align="end"
              >
                QUOTATION
              </Text>
              <Text fontSize={15}>{pdfData.data.quotesData?.number}</Text>
              {/* <Text
                                fontSize={15}
                                border="1px black solid"
                                borderRadius="md"
                                padding={1}
                                fontWeight="bold"
                            >
                                {pdfData.data.quoteData?.status}
                            </Text> */}
              <Text fontWeight="bold">To</Text>
              <Text fontWeight="bold">
                {pdfData.data.client.fname} {pdfData.data.client.lname}
              </Text>
              <Text>{pdfData.data.client.phone}</Text>
              <Text>{pdfData.data.client.address} </Text>
              <Text>{pdfData.data.client.vat} </Text>
              <Divider orientation="horizontal" height={10} />
              <Text>Expiry Date: {pdfData.data.quoteData?.expiry_date}</Text>
              <Text>
                Sales Agent: {pdfData.data.quoteData?.employee_name}{" "}
                {pdfData.data.quoteData?.employee_surname}
              </Text>
              <Text>{pdfData.data.quoteData?.employee_email}</Text>
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
        </div>
      )}
    </Box>
  );
};

export default QuoteApproval;
