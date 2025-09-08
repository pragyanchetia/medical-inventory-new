"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InvoiceBillingForm from "../forms/invoice-form";
import { TotalsProps } from "./create-invoice";

import ReactToPrint from "react-to-print";
import CustomerReceipt from "../reciepts/customer-receipt";
import { server } from "@/utils/server";
import { GetMedicines } from "../../../../backend/src/shared/types";
import { ScrollArea } from "../ui/scroll-area";

const formSchema = z.object({
  patient_name: z
    .string({ required_error: "This field is required!" })
    .min(1, { message: "This field is Required!" }),
  doctor_name: z
    .string({ required_error: "This field is required!" })
    .min(1, { message: "This field is Required!" }),
  diagnostics: z
    .string({ required_error: "This field is required!" })
    .min(1, { message: "This field is Required!" }),
  contact: z.coerce
    .number({
      required_error: "This field is required!",
      invalid_type_error: "This field is required!",
    })
    .min(1, { message: "This field is Required!" }),
  address: z
    .string({ required_error: "This field is required!" })
    .min(1, { message: "This field is Required!" }),
  transaction_id: z
    .string({ required_error: "This field is required!" })
    .min(1, { message: "This field is Required!" }),
});

const defaultValues = {
  patient_name: "",
  doctor_name: "",
  diagnostics: "",
  contact: parseInt(""),
  address: "",
  transaction_id: "",
};

export type memoDetailsTypes = {
  patient_name: string;
  doctor_name: string;
  contact: number | null;
  diagnostics: string;
  address: string;
  transaction_id: string;
};

const CreateMemo = () => {
  const today = new Date();
  const date = new Intl.DateTimeFormat("en-GB").format(today);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [memoNo, setMemoNo] = useState<string>("");

  const datepart = new Date();
  const year = datepart.getFullYear().toLocaleString().substring(3);
  const month = datepart.getUTCMonth().toLocaleString();

  //patient details to print
  const [memoDetails, setMemoDetails] = useState<memoDetailsTypes>({
    patient_name: "",
    doctor_name: "",
    contact: null,
    diagnostics: "",
    address: "",
    transaction_id: "",
  });

  useEffect(() => {
    const memoCount = async () => {
      try {
        const res = await server.get(`/memoRoute`);

        setMemoNo(`KM${year}${month}${res.data.memoCount}`);
      } catch (error) {
        console.log("Client-Side Fetch Error!", error);
      }
    };

    memoCount();
  }, [memoNo, month, year, setMemoDetails, memoDetails]);

  //medicines To Buy:
  const [medicines, setMedicines] = useState<GetMedicines[]>([]);

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

  const componentRef = useRef<HTMLDivElement>(null);
  const reactToPrintRef = useRef<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const alertWindow = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2300);
  };

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    medicines: GetMedicines[],
    totals: TotalsProps
  ) => {
    setIsSubmitting(true);
    const data = {
      ...values,
      memoNo: memoNo,
      gross_amount: totals.grossPrice,
      total_discount: totals.totalDiscount,
      total_gst: totals.totalGst,
      grand_total: totals.grandTotal,
      total_quantity: totals.total_quantity,
      memo_prices: medicines.map((med) => ({
        medicine_name: med.batchToMedicine?.medicine_name,
        batchNo: med.batchNo,
        pack: med.batchToMedicine?.pack,
        mfgBy: med.batchToMedicine?.mfgBy,
        expiry: med.expiry,
        quantity: med.quantity,
        mrp: med.mrp,
        rate: med.rate,
        gst: med.gst,
        discount: med.discount,
        total_quantity: med.quantity,
        total_price: med.total_updated_amount,
      })),
    };

    try {
      setMemoDetails((prev) => ({
        ...prev,
        ...values,
      }));

      let isValid = true; 

      if (medicines.length === 0) {
        isValid = false;
        alertWindow("Select Medicines!");
        return; 
      }
    
      if (isNaN(data.grand_total)) {
        isValid = false;
        alertWindow("Select medicine quantity!");
        return;
      };
      if (isValid) {
        setTimeout(() => {
          if (reactToPrintRef.current) {
            reactToPrintRef.current.handlePrint();
          }
        }, 0);
      }

      await server.post(`/memoRoute/add-new-memo`, data).then((res) => {
        alertWindow(res.data.message || "Error Creating Memo");
        if (res.status === 201) {
          setMedicines(() => []);
          form.reset(defaultValues);
        }
      });
    } catch (error: any) {
      if (error) {
        alertWindow(error.response?.data?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formField = [
    {
      name: "memo_no",
      type: "text",
      Label: "Memo",
      ph: "Enter Memo name",
    },
    {
      name: "patient_name",
      type: "text",
      Label: "Patient Name",
      ph: "Enter Patient name",
    },
    {
      name: "doctor_name",
      type: "text",
      Label: "Doctor Name",
      ph: "Enter Doctor name",
    },
    {
      name: "contact",
      type: "number",
      Label: "Phone No",
      ph: "Enter Phone Number",
    },
    {
      name: "diagnostics",
      type: "text",
      Label: "Diagnostics",
      ph: "Enter Diagnostics",
    },
    {
      name: "address",
      type: "text",
      Label: "Address",
      ph: "Enter Addresss",
    },
    {
      name: "transaction_id",
      type: "text",
      Label: "Transaction Id",
      ph: "Enter Transaction Id",
      value: memoDetails?.transaction_id,
    },
  ];

  const handleSelectedMedicines = (selectedMedicines: GetMedicines[]) => {
    setMedicines(() => [...selectedMedicines]);
  };

  const handleSelectedMedicineQuantity = (
    batchNo: string,
    quantity: number
  ) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med.batchNo === batchNo
          ? {
              ...med,
              quantity: quantity,
              total_updated_amount: quantity * med.mrp,
            }
          : med
      )
    );
  };

  return (
    <ScrollArea className="h-[90vh]">
      <div className="min-h-screen p-5 pt-7">
        <h1 className="text-[1.4rem] font-md mb-7">Customer Receipt:</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onSubmit(values, medicines, totals)
            )}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-3 max-w-[70vw] gap-5 text-sm my-5">
              {formField.map((fld, id) => (
                <FormField
                  control={form.control}
                  key={id}
                  name={fld.name as never}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fld.Label}</FormLabel>
                      <FormControl>
                        {fld.name === "memo_no" ? (
                          <Input
                            className="w-[20vw] font-medium opacity-65"
                            type={fld.type}
                            value={memoNo}
                            placeholder={fld.ph}
                            disabled
                          />
                        ) : (
                          <Input
                            className="w-[20vw] font-medium opacity-65"
                            type={fld.type}
                            placeholder={fld.ph}
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <InvoiceBillingForm
              stockOnly={true}
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
                {isSubmitting ? "Submitting..." : "Print Memo"}
              </Button>
              <ReactToPrint
                ref={reactToPrintRef}
                content={() => componentRef.current}
                documentTitle={`memo_${date}`}
                pageStyle="print"
              />
            </div>
          </form>
        </Form>

        <div ref={componentRef} className="hidden print:block">
          <CustomerReceipt
            medicines={medicines}
            totals={totals}
            memoDetails={memoDetails}
            memoNo={memoNo}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default CreateMemo;
