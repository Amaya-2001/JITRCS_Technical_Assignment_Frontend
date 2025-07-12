export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stockQuantity: number;
    isActive: boolean;
}

export interface InvoiceItem {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface CreateInvoice {
    customerId: number;
    transactionDate: string;
    discountPercentage: number;
    paidAmount: number;
    items: InvoiceItem[];
}

export interface InvoiceItemResponse {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface InvoiceResponse {
    id: number;
    invoiceNumber: string;
    customerId: number;
    customerName: string;
    transactionDate: string;
    discountPercentage: number;
    subtotalAmount: number;
    discountAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    createdDate: string;
    items: InvoiceItemResponse[];
}
