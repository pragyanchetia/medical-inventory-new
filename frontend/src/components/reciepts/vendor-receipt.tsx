
import React from "react";

import { Footnote, PageBottom } from "@fileforge/react-print";
import { TotalsProps, VendorProps } from "../blocks/create-invoice";
import { MedicineSelected } from "../forms/invoice-form";
import { cn } from "@/lib/utils";
import { GetMedicines } from "../../../../backend/src/shared/types";

type recieptType = {
  medicines: GetMedicines[];
  totals: TotalsProps;
  vendorDetails: VendorProps;
};

const VendorReceipt: React.FC<recieptType> = ({
  medicines,
  totals,
  vendorDetails,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const today = new Date();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  const date = today.getDate();
  const formatDate = `${month} ${date}, ${year}`;

  const th = "text-left text-[12px] font-bold py-2 pl-2 border-r-[1px] border-black";
  const tr = "py-2 pl-2 text-[12px] border-r-[1px] border-black";

  return (
    <div className="mt-5 space-y-4">
      <div className="flex justify-center items-center flex-col gap-3">
        <h1 className="uppercase text-4xl text-center">Kusum Medical Store</h1>
        <p className="uppercase text-[1rem] text-center">
          Near Shristi Hostipal
        </p>
        <p className="uppercase text-[1rem] text-center">
          D.L. No: D/DR-423/424, GSTIN: 18DCBPS6147EE2G
        </p>
      </div>
      <div className="grid grid-cols-2 px-5 border-gray-700 border-[1px] text-[.7rem]">
        <div className="p-3 space-y-1 font-semibold border-gray-700 border-r-[1px] ">
          <p className="p-0 mb-1 text-[1rem] font-bold">Vendor Details:</p>
          <p>Vendor Name: {vendorDetails.vendorName}</p>
          <p>Address: {vendorDetails.vendorAdd}</p>
          <p>Phone: {vendorDetails.vendorPh}</p>
          <p>{vendorDetails.vendorDlno}</p>
          <p>GSTIN: {vendorDetails.vendorGstin}</p>
        </div>
        <div className="space-y-1 p-3 text-end">
          <p className="p-0 mb-1">Invoice No: {vendorDetails.invoiceNo}</p>
          <p className="p-0 mb-1">Date: {vendorDetails.invoiceDate}</p>
          <div className="p-0 mb-1 text-end opacity-30 font-bold text-[1.3rem] leading-7">Credit</div>
        </div>
      </div>

      <p className="leading-5 text-[.8rem]">
        All items below corresponds to stock added on {formatDate}. 
      </p>

      <table className="w-full my-12 border-[1px] border-black">
        <tr className="border-b-[1px] border-black">
          <th className={cn(th)}>Sl.</th>
          <th className={cn(th)}>Particulars</th>
          <th className={cn(th)}>Pack</th>
          <th className={cn(th)}>Mfg By</th>
          <th className={cn(th)}>Batch No</th>
          <th className={cn(th)}>Expiry</th>
          <th className={cn(th)}>Qty</th>
          <th className={cn(th)}>MRP</th>
          <th className={cn(th)}>Rate</th>
          <th className={cn(th)}>Disc&#x25;</th>
          <th className={cn(th)}>GST&#x25;</th>
          <th className={cn(th)}>Amount</th>
        </tr>
        {medicines.map((meds, key) => (
          <tr key={key}>
            <td className={cn(tr)}>{key+1}</td>
            <td className={cn(tr)}>{meds.batchToMedicine?.medicine_name}</td>
            <td className={cn(tr)}>{meds.batchToMedicine?.pack}</td> 
            <td className={cn(tr)}>{meds.batchToMedicine?.mfgBy}</td>
            <td className={cn(tr)}>{meds.batchNo}</td>
            <td className={cn(tr)}>{meds.expiry}</td>
            <td className={cn(tr, "text-end pr-2")}>{meds.quantity}</td>
            <td className={cn(tr, "text-end pr-2")}>&#x20B9;{meds.mrp}</td>
            <td className={cn(tr, "text-end pr-2")}>&#x20B9;{meds.rate}</td>
            <td className={cn(tr, "text-end pr-2")}>{meds.discount}&#x25;</td>
            <td className={cn(tr, "text-end pr-2")}>{meds.gst}&#x25;</td>
            <td className={cn(tr, "text-end pr-2")}>&#x20B9;{meds.total_amount}</td>
          </tr>
        ))}
      </table>
      <div className="text-end pr-11 py-3 border-[1px] border-black text-[1rem]">
        <p>Total: {totals.grossPrice}</p>
        <p>Discount: {totals.totalDiscount}</p>
        <p>Gst: {totals.totalGst}</p>
        <p className="font-semibold text-[1.25rem]">Grand Total: {totals.grandTotal}</p>
      </div> 
      <PageBottom>
        <div className="h-px bg-gray-300 my-4" />
      </PageBottom>
    </div>
  );
};

export default VendorReceipt;
