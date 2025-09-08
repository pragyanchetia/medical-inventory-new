export type MedicinesType = {
  batchNo: string;
  quantity: number;
  location: string;
  mrp: number;
  rate: number;
  gst: number;
  discount: number;
  total_amount: number;
  expiry: string;
  batchToMedicine: {
    medicine_name: string;
    medicine_type: "EYE" | "SKIN" | "NULL";
    pack: string;
    mfgBy: string;
    hsnCode?: number;
    mkdBy?: string;
    total_stock: number; 
  };
};

export type MedicineInput = {
  medicineId: string;
  medicine_name: string;
  medicine_type: "EYE" | "SKIN" | "NULL";
  pack: string;
  mfgBy: string;
  hsnCode?: number;
  mkdBy?: string;
  batchNo: string;
  quantity: number;
  location: string;
  mrp: number;
  rate: number;
  gst: number;
  discount: number;
  net_pricing: number;
  total_amount: number;
  expiry: string;
  updatedAt: Date;
  createdAt: Date;
  invoiceNo: string;
}; 

export type GetMedicines = { 
  batchNo: string; 
  expiry: string;
  memoNo?: string;
  quantity: number;
  location?: string;
  mrp: number;
  rate: number;
  discount: number;
  gst: number;
  total_amount: number;
  total_updated_amount: number;
  batchToMedicine: {
    medicine_type?: string;
    mkdBy?: string;
    total_stock?: number;
    createdAt?: Date;
    updatedAt?: Date;
    medicine_name?: string;
    pack?: string;
    hsnCode?: string;
    mfgBy?: string;
  };
};

export type InvoiceMasterType = {
  invoice_date: string | Date;
  vendorMasterId: string;
  invoice_No: string;
  total_discount: number;
  total_gst: number;
  grand_total: number;
  added_stock: number;
  invoice_prices: InvoicePricesType[];
  updatedAt: Date;
};

export type VendorMasterType = {
  vendorMasterId: string;
  vendor_name: string;
  address: string;
  phone_no: number;
  email?: string | null;
  dl_no: string;
  gstin: string;
  vendor_invoices: InvoiceMasterType[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoicePricesType = {
  invoiceMasterId: string;
  medicine_name: string;
  medicine_type: "EYE" | "SKIN" | "NULL";
  batchNo: string;
  quantity: number;
  mrp: number;
  rate: number;
  gst: number;
  discount: number;
  expiry: string;
  total_med_amount: number;
  createdAt: Date;
  updatedAt: Date;
  invoicePriceToMaster: {
    invoice_date: string;
    invoice_No: string;
    gross_amount: number;
    total_discount: number;
    total_gst: number;
    grand_total: number;
    added_stock: number;
    invoiceToVendor: {
      vendor_name: string;
    };
  };
};

export type InvoiceEntry = {
  gross_amount: number;
  grand_total: number;
  total_discount: number;
  total_gst: number;
  vendor: string;
  invoice_No: string;
  invoice_date: string;
  vendorId: string;
  invoice_details: InvoicePricesType[];
};

export type MemoMasterType = {
  memoNo: string;
  patient_name: string;
  doctor_name: string;
  contact: number;
  diagnostics?: string;
  address?: string;
  transaction_id?: string;
  gross_amount: number;
  total_discount: number;
  total_gst: number;
  grand_total: number;
  total_quantity: number;
  memoDate: string;
  memo_prices: MemoPricesType[];
  createdAt: Date;
  updatedAt: Date;
};

export type MemoPricesType = {
  memoMasterId: string,
  medicine_name: string; 
  batchNo: string;
  quantity: number;
  mrp: number;
  rate: number;
  gst: number;
  discount: number;
  total_price: number;
  createdAt: Date;
  updatedAt: Date;
  memoPriceToMaster: {
    patient_name?: string;
    buyer_name?: string;
    address?: string;
    memoNo?: string;
    memoDate?: string;
    grand_total?: number;
  };
  expiry: string;
  pack: string;
  hscCode?: string;
  mfgBy: string
};

export type memoEditInput = {
  memoMasterId?: string,
  memoNo?: string;
  memoDate?: string;
  patient_name?: string;
  doctor_name?: string;
  address?: string;
  contact?: number;
  diagnostics?: string;
  transaction_id?: string;
  total_discount?: number;
  total_gst?: number;
  gross_amount?: number;
  grand_total?: number;
  total_quantity?: number;
  memo_prices?: memoPriceInput[];
}; 

export type memoPriceInput = {
  memoNo?: string; 
  medicine_name: string;
  batchNo: string;
  quantity: number;
  mrp: number;
  discount: number;
  rate: number;
  gst: number;
  total_price: number;
  expiry: string;
  pack: string;
  hsnCode?: string;
  mfgBy: string;
}

enum userRole {
  ADMIN,
  MEMBER,
}

export type UserType = {
  userId: string;
  role: userRole;
  username: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
};

export enum componentType {
  invoiceForm = "invoiceForm",
  memoForm = "memoForm",
  medicineForm = "medicineForm",
  vendorForm = "vendorForm",
  tables = "tables",
  backup = "backup"
}

export enum tableTypes {
  medicineTable = "medicineTable",
  vendorTable = "vendorTable",
  purchaseTable = "purchaseTable",
  sellsTable = "sellsTable",
  memos = "memos",
}