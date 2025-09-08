"use client";

import React, { useCallback, useState, useRef, useEffect } from "react"; 
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import ReactToPrint from "react-to-print";
import VendorReceipt from "../reciepts/vendor-receipt";
 
import VendorSelector from "@/components/vendor-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { server } from "@/utils/server";
import { GetMedicines } from "../../../../backend/src/shared/types";
import InvoiceBillingForm from "../forms/invoice-form";
import { ScrollArea } from "../ui/scroll-area";

export const formSchema = z.object({  
  invoiceNo: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  invoiceDate: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
});

export interface TotalsProps {
  grandTotal: number;
  totalDiscount: number;
  totalGst: number;
  grossPrice: number;
  total_quantity: number;
}

export interface VendorProps {
  vendorId: string | undefined;
  vendorName: string | undefined;
  vendorAdd: string | undefined;
  vendorPh: number | undefined;
  vendorDlno: string | undefined;
  vendorGstin: string | undefined;
  invoiceNo: string | undefined;
  invoiceDate: string | undefined; 
}

const CreateInvoice = () => {
  const today = new Date();
  const date = new Intl.DateTimeFormat('en-GB').format(today); 

  const [medicines, setMedicines] = useState<GetMedicines[]>([]);

  const [vendorDetails, setVendorDetails] = useState<VendorProps>({
    vendorId: "",
    vendorName: "",
    vendorAdd: "",
    vendorPh: 0,
    vendorDlno: "",
    vendorGstin: "",
    invoiceNo: "",
    invoiceDate: "", 
  });
 
  const handleVendor = useCallback(
    (
      vendorId: string | undefined,
      vendorName: string | undefined,
      vendorAdd: string | undefined,
      vendorPh: number | undefined,
      vendorDlno: string | undefined,
      vendorGstin: string | undefined, 
    ) => {
      setVendorDetails((prev) => ({
        ...prev,
        vendorId,
        vendorName,
        vendorAdd,
        vendorPh,
        vendorDlno,
        vendorGstin,
      }));
    },
    [setVendorDetails]
  );

  //all the totals:
  const [totals, setTotals] = useState<TotalsProps>({
    grandTotal: 0,
    totalDiscount: 0,
    totalGst: 0,
    grossPrice: 0,
    total_quantity: 0,
  });
  const handleTotals = useCallback(
    (gross: number, gt: number, td: number, gst: number) => {
      setTotals((prev) => ({
        ...prev,
        grossPrice: gross,
        grandTotal: gt,
        totalDiscount: td,
        totalGst: gst,
      }));
    },
    [setTotals]
  );

  const handleSelectedMedicines = (selectedMedicines: GetMedicines[]) => {
    setMedicines(()=> ([...selectedMedicines]))
  }  

  const handleSelectedMedicineQuantity = (batchNo: string, quantity: number) => {
    setMedicines((prev)=> prev.map((med)=> med.batchNo === batchNo ? { ...med, quantity: quantity, total_updated_amount: quantity*med.rate} : med))
  }
   
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });


  const componentRef = useRef<HTMLDivElement>(null);
  const reactToPrintRef = useRef<any>(null);  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const alertWindow = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    medicines: GetMedicines[],
    totals: TotalsProps,
    vendorDetails: VendorProps
  ) => {
    const data = {
      ...values,
      gross_amount: totals.grossPrice,
      grand_total: totals.grandTotal,
      total_discount: totals.totalDiscount,
      total_gst: totals.totalGst,
      vendor: vendorDetails.vendorId,
      invoice_No: values.invoiceNo,
      invoice_date: values.invoiceDate, 
      invoice_details: medicines.map((med) => ({
        medicine_name: med.batchToMedicine?.medicine_name,
        medicine_type: med.batchToMedicine?.medicine_type,
        batchNo: med.batchNo,
        quantity: med.quantity,
        mrp: med.mrp,
        rate: med.rate,
        gst: med.gst,
        discount: med.discount,
        expiry: med.expiry,
        total_med_amount: med.total_updated_amount,
      })),
    }; 
    
    setIsSubmitting(true); 
    try {  
      setVendorDetails((prev) => ({
        ...prev,
        invoiceNo: values.invoiceNo,
        invoiceDate: values.invoiceDate, 
      }));

      let isValid = true; 

      if(vendorDetails.vendorId === undefined) {
        isValid = false;
        alertWindow("add wholeseller!"); 
        return;
      }

      if(medicines.length === 0) {
        isValid = false;
        alertWindow("add medicines!");
        return;
      }
      if(isNaN(data.grand_total)) {
        isValid = false;
        alertWindow("select medicine quantity!");
        return;
      };
      if (isValid) {
        setTimeout(() => {
          if (reactToPrintRef.current) {
            reactToPrintRef.current.handlePrint();
          }
        }, 0);
      }
      await server.post(
        `/invoiceRoute/create-invoice`,
        data
      ).then((res)=> alertWindow(res.data.message || "Error Creating Invoice"));

    } catch (error: any) {
      if (error) { 
        alertWindow(error.response?.data?.message);
      }
    } finally {
      setIsSubmitting(false);  
    }
  }; 

  return (
    <ScrollArea className="h-[90vh]">
      <div className="min-h-screen p-5 pt-7">
        <h1 className="text-[1.4rem] font-md mb-7">Create Invoice:</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>{            
              onSubmit(values, medicines, totals, vendorDetails);
            }
            )}
            className="grid grid-rows-[.4fr_.5fr] mb-6 min-w-[95vw]"
          >
            <VendorSelector 
              handleVendor={handleVendor} 
              form={form}
            />
            <InvoiceBillingForm
              stockOnly={false}
              selectedMedicines={medicines}
              handleSelectedMedicineQuantity={handleSelectedMedicineQuantity}
              handleSelectedMedicines={handleSelectedMedicines}
              totals={totals}
              handleTotals={handleTotals}
            />
            <div className="flex flex-row justify-end items-center gap-2 -mt-14 mr-6">
              <div className="text-xl mb-3 text-red-500 font-semibold">
                <h3>{alertMessage}</h3>
              </div>
              <Button type="submit" className="hover:text-green-500 w-24">
              {isSubmitting ? "Submitting..." : "Print Invoice"}
              </Button>
              <ReactToPrint
                ref={reactToPrintRef}
                content={() => componentRef.current}
                documentTitle={`invoice_${date}`}
                pageStyle="print"
              />
            </div>
          </form>
        </Form>

        <div ref={componentRef} className="hidden print:block">
          <VendorReceipt
            medicines={medicines}
            totals={totals}
            vendorDetails={vendorDetails}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default CreateInvoice;
