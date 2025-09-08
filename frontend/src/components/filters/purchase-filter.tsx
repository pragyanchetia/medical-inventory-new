"use client";

import React, { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InvoicePricesType } from "../../../../backend/src/shared/types";

export type searchTypes = {
  invoiceNo: string;
  medicineName: string;
  batchNo: string;
  vendorName: string;
  expiry: string;
  buyingDate: string;
  invoiceDate: string;
};

interface searchProps {
  logs: InvoicePricesType[];
  handleFilterData: (filteredData: InvoicePricesType[]) => void;
}
const PurchaseFilter = ({ logs, handleFilterData }: searchProps) => {
  const [tempFilter, setTempFilter] = useState<InvoicePricesType[]>([]);

  const handleData = useMemo(
    () => handleFilterData(tempFilter),
    [tempFilter, handleFilterData]
  );

  const [searchParams, setSearchParams] = useState<searchTypes>({
    invoiceNo: "",
    medicineName: "",
    batchNo: "",
    vendorName: "",
    expiry: "",
    buyingDate: "",
    invoiceDate: "",
  });
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const updatedParams = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      e.target.name === "invoiceNo" && updatedParams?.invoiceNo
        ? setTempFilter(
            logs.filter((lg) =>
              lg.invoicePriceToMaster?.invoice_No
                ?.toLowerCase()
                .includes(updatedParams?.invoiceNo.toLowerCase())
            )
          )
        : e.target.name === "medicineName" && updatedParams?.medicineName
        ? setTempFilter(
            logs.filter((lg) =>
              lg.medicine_name
                ?.toLowerCase()
                .includes(updatedParams?.medicineName.toLowerCase())
            )
          )
        : e.target.name === "batchNo" && updatedParams?.batchNo
        ? setTempFilter(
            logs.filter((lg) =>
              lg.batchNo
                ?.toLowerCase()
                .includes(updatedParams?.batchNo.toLowerCase())
            )
          )
        : e.target.name === "vendorName" && updatedParams?.vendorName
        ? setTempFilter(
            logs.filter((lg) =>
              lg.invoicePriceToMaster?.invoiceToVendor?.vendor_name
                ?.toLowerCase()
                .includes(updatedParams?.vendorName.toLowerCase())
            )
          )
        : e.target.name === "expiry" && updatedParams?.expiry
        ? setTempFilter(
            logs.filter((lg) => lg.expiry?.includes(updatedParams?.expiry))
          )
        : e.target.name === "invoiceDate" && updatedParams?.invoiceDate
        ? setTempFilter(
            logs.filter((lg) =>
              lg.invoicePriceToMaster?.invoice_date?.includes(
                updatedParams?.invoiceDate
              )
            )
          )
        : setTempFilter(logs);

      return updatedParams;
    });
  };
  handleData;
  const filtersInput = [
    {
      name: "invoiceNo",
      type: "text",
      ph: "Enter Memo No",
      label: "Invoice No",
      value: searchParams.invoiceNo,
    },
    {
      name: "medicineName",
      type: "text",
      ph: "Enter Medicine Name",
      label: "Medicine Name",
      value: searchParams.medicineName,
    },
    {
      name: "batchNo",
      type: "text",
      ph: "Enter Batch No",
      label: "Batch No",
      value: searchParams.batchNo,
    },
    {
      name: "vendorName",
      type: "text",
      ph: "Enter Vendor Name",
      label: "Vendor Name",
      value: searchParams.vendorName,
    },
    {
      name: "expiry",
      type: "date",
      ph: "Enter Expiry Date",
      label: "Expiry Date",
      value: searchParams.expiry,
    },
    {
      name: "invoiceDate",
      type: "date",
      ph: "Enter Invoice Date",
      label: "Invoice Date",
      value: searchParams.invoiceDate,
    },
  ];

  return (
    <div className="flex flex-row min-w-full flex-wrap justify-start gap-x-4 mb-2">
      {filtersInput.map((ip, key) => (
        <div className="w-[15vw]" key={key}>
          <Label>{ip.label}</Label>
          <Input
            type={ip.type}
            placeholder={ip.ph}
            name={ip.name}
            value={ip.value}
            onChange={(e) => handleSearchParams(e)}
            className="rounded-sm max-w-[100%]  max-h-[30px] focus-visible:ring-0 mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default PurchaseFilter;
