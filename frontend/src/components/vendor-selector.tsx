"use client";
import React, { useEffect, useState } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
 
import { UseFormReturn } from "react-hook-form";
import VendorList from "./select-vendor"; 

export interface selectedVendorArgsProps {
  vendorId: string;
  vendor_name: string;
  address: string;
  phone_no: number;
  dl_no: string;
  gstin: string;
}


interface GetVendorProp {
  handleVendor: (
    vendorId: string | undefined,
    vendorName: string | undefined,
    vendorAdd: string | undefined,
    vendorPh: number | undefined,
    vendorDlno: string | undefined,
    vendorGstin: string | undefined
  ) => void;
  form: UseFormReturn<{
    invoiceNo: string, 
    invoiceDate: string
  }>
}

const VendorSelector: React.FC<GetVendorProp> = ({
  handleVendor,
  form
}) => { 
  const [selectedVendor, setSelectedVendor] = useState<selectedVendorArgsProps>();

  const formField = [
    {
      name: "vendorId",
      Label: "Wholesaler Id",
      ph: "Enter wholesaler id",
      value: selectedVendor?.vendorId,
    },
    {
      name: "vendorName",
      Label: "Wholesaler Name",
      ph: "Enter wholesaler name",
      value: selectedVendor?.vendor_name,
    },
    {
      name: "address",
      Label: "Address",
      ph: "Enter wholesaler address",
      value: selectedVendor?.address,
    },
    {
      name: "phone_no",
      Label: "Phone Number",
      ph: "Enter wholesaler phone no",
      value: selectedVendor?.phone_no,
    },
    {
      name: "dlno",
      Label: "D.L. No.",
      ph: "Enter D.L. No.",
      value: selectedVendor?.dl_no,
    },
    {
      name: "gstin",
      Label: "GSTIN",
      ph: "Enter GSTIN",
      value: selectedVendor?.gstin,
    },
    {
      name: "invoiceNo",
      Label: "Invoice No",
      ph: "Enter Invoice No",
      type: "text",
    },
    {
      name: "invoiceDate",
      Label: "Entry Date",
      ph: "Enter Date of Entry",
      type: "date", 
    },
  ];

  //put the selected vendor details to fields:
  const getThatVendor = ({
    vendorId,
    vendor_name,
    address,
    phone_no,
    dl_no,
    gstin,
  }: selectedVendorArgsProps): void => {
    setSelectedVendor({
      vendorId,
      vendor_name,
      address,
      phone_no,
      dl_no,
      gstin,
    });
  };

  useEffect(() => {
    handleVendor(selectedVendor?.vendorId, selectedVendor?.vendor_name, selectedVendor?.address, selectedVendor?.phone_no, selectedVendor?.dl_no, selectedVendor?.gstin);
  }, [selectedVendor, handleVendor]);

  
  return (
    <div className="text-lg flex flex-col max-w-[60vw] ml-7">
      <h2 className="font-semibold text-[1.2rem] m-5 ml-0">Wholesaler Details</h2>

      <VendorList getThatVendor={getThatVendor} />

      <div className="grid grid-cols-3 max-w-[50vw] gap-5 text-sm my-5">
        {formField.map((fld, id) => (
          <FormField
            control={form.control}
            key={id}
            name={fld.name as never}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">{fld.Label}</FormLabel>
                <FormControl>
                  {fld.name === "invoiceDate" || fld.name === "invoiceNo" ? (
                    <Input
                      placeholder={fld.ph}
                      {...field} 
                      type={fld.type}
                      value={fld.value}
                    />
                  ) : (
                    <Input
                      placeholder={fld.ph}
                      {...field}
                      value={fld.value}
                      type={fld.type}
                      disabled
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default VendorSelector;
