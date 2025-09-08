"use client";

import React, { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { VendorMasterType } from "../../../../backend/src/shared/types";

export type searchTypes = {
  vendorId: string;
  vendorName: string;
  orderId: string;
};

interface searchProps {
  vendors: VendorMasterType[];
  handleFilterData: (filteredData: VendorMasterType[]) => void;
}
const VendorFilter = ({ vendors, handleFilterData }: searchProps) => {
  const [tempFilter, setTempFilter] = useState<VendorMasterType[]>([]);

  const handleData = useMemo(
    () => handleFilterData(tempFilter),
    [tempFilter, handleFilterData]
  );

  const [searchParams, setSearchParams] = useState<searchTypes>({
    vendorId: "",
    vendorName: "", 
    orderId: "",
  });
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const updatedParams = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      e.target.name === "vendorId" && updatedParams?.vendorId
        ? setTempFilter(
            vendors.filter((vendor) =>
                vendor.vendorMasterId
                ?.toLowerCase()
                .includes(updatedParams?.vendorId.toLowerCase())
            )
          )
        : e.target.name === "vendorName" && updatedParams?.vendorName
        ? setTempFilter(
            vendors.filter((vendor) =>
                vendor.vendor_name
                ?.toLowerCase()
                .includes(updatedParams?.vendorName.toLowerCase())
            )
          )
        : e.target.name === "orderId" && updatedParams?.orderId
        ? setTempFilter(
            vendors.filter((vendor) =>
                vendor.vendor_invoices?.some((inv) =>
                  updatedParams?.orderId ? inv.invoice_No?.toLowerCase().includes(updatedParams?.orderId.toLowerCase()) : false
                )
            ))
        : setTempFilter(vendors);

      return updatedParams;
    });
  };

  handleData;

  const filtersInput = [
    {
      name: "vendorId",
      label: "Wholesaler ID",
      type: "text",
      ph: "Enter Wholesaler Id",
      value: searchParams.vendorId,
    },
    {
      name: "vendorName",
      label: "Wholesaler Name",
      type: "text",
      ph: "Enter Wholesaler Name",
      value: searchParams.vendorName,
    },
    {
      name: "orderId",
      label: "Order Id",
      type: "text",
      ph: "Enter Order Id",
      value: searchParams.orderId,
    },
  ];

  return (
    <div className="flex flex-row min-w-full justify-start gap-2">
    {filtersInput.map((ip, key) => (
      <div className="sm:w-[25vw] md:w-[16vw]" key={key}>
        <Label>{ip.label}</Label>
        <Input
          type={ip.type}
          placeholder={ip.ph}
          name={ip.name}
          value={ip.value}
          onChange={(e) => handleSearchParams(e)}
          className="rounded-sm w-[95%] max-h-[30px] focus-visible:ring-0 mt-1"
        />
      </div>
    ))}
  </div>
  );
};

export default VendorFilter;
