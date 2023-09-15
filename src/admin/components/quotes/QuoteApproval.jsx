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
import { sendPdfByEmail, BASE_URL } from "../../../API/api";
import ConfirmationAlert from "../../../components/common/ConfirmationAlert";


const QuoteApproval = ({ data, handleAddUpdateDeleteQuote, onClose }) => {
    const [pdfData, setPdfData] = useState(null);
    const [Items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div>
            <Flex direction="row" justify="end" id="backToTop">
                <Button
                    variant="outline"
                    colorScheme="green"
                    mr={2}
                >
                    Send PDF
                </Button>
                <Button variant="solid" colorScheme="red" >
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
                <div  style={{ padding: "2rem" }}>
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

                </div>
            )}
            
        </div>
    )
}

export default QuoteApproval