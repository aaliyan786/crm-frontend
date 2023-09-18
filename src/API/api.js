import axios from "axios";
export const BASE_URL = "http://localhost:3000";

const token = localStorage.getItem("token");
export const updateQuoteApprovalStatus = async (quoteId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/quote/${quoteId}/approvedByClient`,
      { isApprovedByClient: 1 } // Include the data in the request body
    );
    return response.data; // You can return the response data if needed
  } catch (error) {
    throw error;
  }
};

export const sendRegretEmail = async (
  employeeId,
  subject,
  clientId,
  description,
  employeePassword
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/send-regret`, {
      employeeId,
      subject,
      clientId,
      description,
      employeePassword,
    });

    return response.data; // Return the response data from the API
  } catch (error) {
    throw error; // Handle or throw the error as needed
  }
};
export const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports/admin`);
    const data = response.data;

    const statusList = [
      "DRAFT",
      "PENDING",
      "SENT",
      "EXPIRED",
      "DECLINED",
      "ACCEPTED",
      "LOST",
    ];

    const formattedData = {
      invoiceData: [
        {
          title: "Revenue",
          value: data.totalRevenue + " AED",
          textColor: "teal.500",
          color: "teal.200",
        },
        {
          title: "Sent Quotes",
          value: data.totalQuotesSent,
          textColor: "purple.500",
          color: "purple.200",
        },
        {
          title: "Draft Quotes",
          value: data.totalQuoteDrafts,
          textColor: "blue.500",
          color: "blue.200",
        },
        {
          title: "Approved Quotes",
          value: data.totalQuoteApproved,
          textColor: "red.500",
          color: "red.200",
        },
      ],
      statusGraphData: [
        {
          title: "Draft",
          value: data.invoiceStatusPercentages.draft_count,
          color: "blue.200",
        },
        {
          title: "Pending",
          value: data.invoiceStatusPercentages.pending_count,
          color: "purple.200",
        },
        {
          title: "Sent",
          value: data.invoiceStatusPercentages.sent_count,
          color: "green.200",
        },
        {
          title: "Expired",
          value: data.invoiceStatusPercentages.expired_count,
          color: "orange.200",
        },
        {
          title: "Declined",
          value: data.invoiceStatusPercentages.declined_count,
          color: "red.200",
        },
        {
          title: "Accepted",
          value: data.invoiceStatusPercentages.accepted_count,
          color: "teal.200",
        },
        {
          title: "Lost",
          value: data.invoiceStatusPercentages.lost_count,
          color: "gray.200",
        },
      ],
      customerPercentage: {
        title: "customerPercentage",
        value: data.customerAddedThisMonthPercentage + " %",
      },
      recentInvoicesData: data.recentInvoices.map((invoice) => ({
        number: invoice.number,
        client: invoice.client_name,
        total: invoice.total_amount + " AED",
        status: statusList[invoice.status - 1],
        date: new Date(invoice.invoice_current_date).toLocaleDateString(),
      })),
      recentQuotesData: data.recentQuotes.map((quote) => ({
        number: quote.number,
        client: quote.client_name,
        total: quote.total_amount + " AED",
        status: statusList[quote.status - 1],
        date: new Date(quote.quote_date).toLocaleDateString(),
      })),
    };
    return formattedData;
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw error;
  }
};



export const updateClientDetails = async (clientId, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/client/${clientId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (data.success) {
      return data;
    } else {
      throw new Error("Failed to update client data");
    }
  } catch (error) {
    console.error("Error updating client data:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/client/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    if (data.success) {
      return data.data;
    } else {
      throw new Error("Failed to delete customer");
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
export const getInvoiceById = async (invoiceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoice/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("response.data get invoice by id ", response.data);
    return response.data.InvoiceData;
  } catch (error) {
    throw error;
  }
};

export const getAllQuotes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/quote/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllQuotesByEmployee = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/employee/documents`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllApprovedByClientQuotes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/quote/getAllApprovedByClientQuotes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AddClient = async (clientData) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      vat,
      address,
      date,
      company_name,
      added_by_employee,
    } = clientData;

    const response = await axios.post(`${BASE_URL}/client`, {
      fname,
      lname,
      email,
      phone,
      vat,
      address,
      date,
      company_name,
      added_by_employee,
    });
    if (response.status === 201 || response.status === 200) {
      return "Client added successfully";
    } else {
      throw new Error("Failed to add the new client");
    }
  } catch (error) {
    console.error("Error adding the new client:", error);
    throw error;
  }
};

export const createInvoiceApi = async (invoiceData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/invoice/create`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createQuoteApi = async (QuoteData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/quote/create`,
      QuoteData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteInvoice = async (invoiceId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/invoice/${invoiceId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteQuote = async (quoteId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/quote/${quoteId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuoteById = async (quoteId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/quote/${quoteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPaymentModes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/payment-modes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment modes:", error);
    throw error;
  }
};

export const makePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/payment/make`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making payment:", error);
    throw error;
  }
};

export async function getPaymentsByInvoiceId(invoiceId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/payment/invoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getPaymentsByQuoteId(quoteId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/payment/quote/${quoteId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function editInvoiceItem(invoiceItemId, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/invoice/item/${invoiceItemId}/edit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function editQuoteItem(quoteItemId, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/quote/item/${quoteItemId}/edit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function deleteInvoiceItem(invoiceItemId) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/invoice/item/${invoiceItemId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function deleteQuoteItem(quoteItemId) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/quote/item/${quoteItemId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addInvoiceItem(invoiceId, data) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/invoice/${invoiceId}/item/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function addQuoteItem(quoteId, data) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/quote/${quoteId}/item/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateInvoiceData(invoiceId, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/invoice/${invoiceId}/edit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function updateQuoteData(quoteId, data) {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/quote/${quoteId}/edit`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("edit quote response", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const sendRequest = async (url, data) => {
  console.log("dataaaaaaaaaa", data);
  try {
    const response = await axios.post(`${BASE_URL}/api${url}`, data);
    return response.data;
  } catch (error) {
    // Handle error here, e.g., log the error or show a user-friendly error message.
    throw error;
  }
};

export const addOrUpdateLogo = async (logoFormData) => {
  console.log("api formData.entries:", Array.from(logoFormData.entries())); // Convert iterator to array
  console.log("api formData.keys:", Array.from(logoFormData.keys()));
  return sendRequest("/logo/add-or-update", logoFormData);
};

export const addOrUpdateName = async (nameData) => {
  return sendRequest("/name/add-or-update", nameData);
};

export const addOrUpdateAddress = async (addressData) => {
  return sendRequest("/address/add-or-update", addressData);
};

export const addOrUpdateVatNumber = async (vatNumberData) => {
  return sendRequest("/vat-no/add-or-update", vatNumberData);
};

export const addOrUpdateStamp = async (stampFormData) => {
  return sendRequest("/stamp/add-or-update", stampFormData);
};

export const getAllSettings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/get-settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    // Handle error here, e.g., log the error or show a user-friendly error message.
    throw error;
  }
};

export const getAllPaymentModes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/payment-modes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("res: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment modes:", error);
    throw error;
  }
};

export const updatePaymentModeRecord = async (
  paymentModeID,
  paymentModeData
) => {
  const url = `${BASE_URL}/api/payment-modes/${paymentModeID}`;
  try {
    const response = await axios.put(url, paymentModeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePaymentMode = async (paymentModeId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/payment-modes/${paymentModeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function createPaymentMode(paymentModeData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/payment-modes`,
      paymentModeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllEmployees() {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/all-employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}

export async function deleteEmployee(employeeId) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/admin/delete-employee/${employeeId}`
    );
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}
export async function deletePayment(paymentId) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/payment/${paymentId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the data from the API response
  } catch (error) {
    throw error;
  }
}

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/create-employee`,
      employeeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error;
  }
};

export async function getQuotesByEmployee(employeeId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/quotes-and-items-by-employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInvoicesByEmployee(employeeId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/admin/invoices-and-items-by-employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateEmployee = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/admin/edit-employee/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/admin/create-announcement`,
      announcementData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function getAnnouncementByEmployee() {
  try {
    const response = await axios.get(`${BASE_URL}/api/employee/announcements`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAllLostQuotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/get-all-lostQuotes`);
    const data = await response.json();
    return data.lostQuotes || [];
  } catch (error) {
    console.error("Error fetching lost quotes:", error);
    throw error;
  }
};

export const deleteLostQuote = async (quoteId, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/admin/lost-quotes/${quoteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting lost quote:", error);
    throw error;
  }
};

export async function getInvoicePdfById(invoiceId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/invoice/${invoiceId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getdashboarddatasales() {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports/sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    const statusList = [
      "DRAFT",
      "PENDING",
      "SENT",
      "EXPIRED",
      "DECLINED",
      "ACCEPTED",
      "LOST",
    ];

    const formattedData = {
      invoiceData: [
        {
          title: "Sent Quotes",
          value: data.salesReport.quoteSet,
          textColor: "purple.500",
          color: "purple.200",
        },
        {
          title: "Draft Quotes",
          value: data.salesReport.quoteDraft,
          textColor: "blue.500",
          color: "blue.200",
        },
        {
          title: "Approved Quotes",
          value: data.salesReport.quoteApproved,
          textColor: "red.500",
          color: "red.200",
        },
      ],
      recentQuotesData: data.recentQuotes.map((quote) => ({
        // number: quote.number,
        client: quote.client_name,
        total: quote.total_amount + " AED",
        status: statusList[quote.status - 1],
        date: new Date(quote.quote_date).toLocaleDateString(),
      })),
    };
    return formattedData;
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw error;
  }
}

export async function getdashboarddataaccounts() {
  try {
    const response = await axios.get(`${BASE_URL}/api/reports/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("api", response.data);
    const data = response.data;
    const statusList = [
      "DRAFT",
      "PENDING",
      "SENT",
      "EXPIRED",
      "DECLINED",
      "ACCEPTED",
      "LOST",
    ];

    const formattedData = {
      recentInvoicesData: data.recentInvoices.map((invoice) => ({
        number: invoice.number,
        client: invoice.client_name,
        total: invoice.total_amount + " AED",
        status: statusList[invoice.status - 1],
        date: new Date(invoice.invoice_current_date).toLocaleDateString(),
      })),
    };
    return formattedData;
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw error;
  }
}

export async function getQuotePdfById(quoteId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/quote/${quoteId}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const fetchAllInvoices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invoice/all`);
    const data = response.data;
    console.log('admin incoice  response.data', response.data)
    if (data.success) {
      return data.Invoice      ;
    } else {
      throw new Error("Failed to fetch customer data");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

export const getdata = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/employee/documents`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log('accounts incoice  response.data', response.data)
    if (data.success) {
      return data.invoices;
    } else {
      throw new Error("Failed to fetch customer data");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
}


export const getAllQuotesByAdminStatus = async (type) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/quote/${type}/adminStatus`
    );
    console.log("response.data", response.data);
    console.log(type, "API STATUS QUOTE: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

export const acceptRejectQuote = async (quoteId, isApproved) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/quotes/${quoteId}/approval`,
      {
        is_approved_by_admin: isApproved ? 2 : 3, // 2 for accepted, 3 for rejected
      }
    );
    return response.data; // You can handle the response data as needed
  } catch (error) {
    throw error; // Handle or log the error as needed
  }
};

export async function updatePayment(paymentId, paymentData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/payment/${paymentId}/edit`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function sendPdfByEmail(
  pdfFile,
  employeeId,
  clientId,
  employeePassword
) {
  try {
    const formData = new FormData();

    // Append the PDF file with the desired name
    formData.append("pdfFile", pdfFile, pdfFile.name);

    formData.append("employeeId", employeeId);
    formData.append("clientId", clientId);
    formData.append("employeePassword", employeePassword);

    const response = await axios.post(`${BASE_URL}/api/send-pdf`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // Assuming the API returns a response object with data
  } catch (error) {
    throw error; // Handle or log the error as needed
  }
}


export const fetchCustomerDataByEmployee = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/employee/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = response.data;
    console.log("hello", response.data)
    if (data.success) {
      return response.data;
    } else {
      throw new Error("Failed to fetch customer data");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

// Function to fetch customer data
export const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/clients`);
    const data = response.data;
    if (data.success) {
      return response.data;
    } else {
      throw new Error("Failed to fetch customer data");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};


export const fetchAllAccountsEmployee = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/all-accountsEmployees`);
    const data = response.data;
    if (data.success) {
      return response.data;
    } else {
      throw new Error("Failed to fetch customer data");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};


// Function to convert a quote to an invoice and assign it to a specific employee
export const convertQuoteToInvoice = async (quoteId, employeeEmail) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/quote/convertQuoteToInvoice`, {
      quoteId,
      employeeEmail,
    });
    return response.data; // You can return the response data or handle it as needed
  } catch (error) {
    throw error; // Handle the error in your component
  }
};