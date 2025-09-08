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
import { TotalsProps } from "./create-invoice";

import ReactToPrint from "react-to-print";
import CustomerReceipt from "../reciepts/customer-receipt";
import { server } from "@/utils/server";
import {
  GetMedicines,
  memoEditInput,
} from "../../../../backend/src/shared/types";
import InvoiceBillingForm from "../forms/invoice-form";
import { ScrollArea } from "../ui/scroll-area";
import { memoDetailsTypes } from "./add-new-memo";

const formSchema = z.object({});

interface handleEditProps {
  openEdit: (isTrue: boolean) => void;
  memoId: string;
}

const EditMemo = ({ openEdit, memoId }: handleEditProps) => {
  const [memoInputs, setMemoInputs] = useState<memoEditInput>();
  const [medicines, setMedicines] = useState<GetMedicines[] | undefined>([]);
  const [memoDetails, setMemoDetails] = useState<memoDetailsTypes>({
    patient_name: "",
    doctor_name: "",
    contact: null,
    diagnostics: "",
    address: "",
    transaction_id: "",
  });

  //get edited memo Details:
  useEffect(() => {
    const getEditMemo = async () => {
      try {
        await server
          .get(`/memoRoute/get-edited-memo?memoId=${memoId}`)
          .then((res) => {
            if (res.data?.message) {
              alert(res.data.message); // Display the message
              openEdit(false); // Then close the edit modal
            } else {
              setMemoInputs(res.data); // If no message, update the inputs
            }
          });
      } catch (error: any) {
        if (error) {
          console.log(error);
          alert(error.response?.data?.message);
        }
      }
    };

    getEditMemo();
  }, [memoId, openEdit]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemoInputs((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "contact" ? e.target.valueAsNumber : e.target.value,
    }));
  };

  useEffect(() => {
    const handleSetMedicines = () => {
      const newTargetArray = memoInputs?.memo_prices?.map((src) => ({
        batchNo: src.batchNo,
        expiry: src.expiry,
        quantity: src.quantity,
        mrp: src.mrp,
        rate: src.rate,
        discount: src.discount,
        gst: src.gst,
        medicine_name: src.medicine_name,
        total_amount: src.total_price,
        total_updated_amount: src.total_price,
        batchToMedicine: {
          medicine_name: src.medicine_name,
          pack: src.pack,
          hsnCode: src.hsnCode,
          mfgBy: src.mfgBy,
        },
      }));

      setMedicines(newTargetArray);
    };

    handleSetMedicines();
  }, [memoInputs?.memo_prices, memoInputs]);

  //all the totals:
  const [totals, setTotals] = useState<TotalsProps>({
    grandTotal: memoInputs?.grand_total as number,
    totalDiscount: memoInputs?.total_discount as number,
    totalGst: memoInputs?.total_gst as number,
    grossPrice: memoInputs?.gross_amount as number,
    total_quantity: memoInputs?.total_quantity as number,
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
    setTimeout(() => setAlertMessage(""), 2400);
  };

  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    medicines: GetMedicines[] | undefined,
    totals: TotalsProps
  ) => {
    setIsSubmitting(true);
    const data = {
      ...values,
      memoNo: memoId,
      patient_name: memoInputs?.patient_name,
      doctor_name: memoInputs?.doctor_name,
      contact: memoInputs?.contact,
      diagnostics: memoInputs?.diagnostics,
      address: memoInputs?.address,
      transaction_id: memoInputs?.transaction_id,
      gross_amount: totals.grossPrice,
      total_discount: totals.totalDiscount,
      total_gst: totals.totalGst,
      grand_total: totals.grandTotal,
      total_quantity: totals.total_quantity, //total quantity should be changed
      memo_prices: medicines?.map((med) => ({
        memoNo: memoInputs?.memoNo,
        rate: med.rate,
        batchNo: med.batchNo,
        quantity: med.quantity,
        total_quantity: med.quantity,
        total_price: med.total_updated_amount,
      })),
    };
    try {
      setMemoDetails((prev) => ({
        ...prev,
        patient_name: memoInputs?.patient_name as string,
        doctor_name: memoInputs?.doctor_name as string,
        contact: memoInputs?.contact as number,
        diagnostics: memoInputs?.diagnostics as string,
        address: memoInputs?.address as string,
        transaction_id: memoInputs?.transaction_id as string,
      }));

      let isValid = true;

      if (medicines?.length === 0) {
        isValid = false;
        alertWindow("Select Medicines!");
        return;
      }

      if (isNaN(data.grand_total)) {
        isValid = false;
        alertWindow("select medicine quantity!");
        return;
      }

      if (isValid) {
        setTimeout(() => {
          if (reactToPrintRef.current) {
            reactToPrintRef.current.handlePrint();
          }
        }, 0);
      }

      await server
        .put(`/memoRoute/set-memo`, data)
        .then((res) => {
          alertWindow(res.data.message || "Error Updating Memo");
        })
        .finally(() => {
          openEdit(false);
        });
    } catch (error: any) {
      if (error) {
        console.log(error);
        alert(error.response?.data?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const formField = [
    {
      name: "memo_no",
      type: "text",
      Label: "Memo",
      ph: "Enter Memo name",
      value: memoId,
    },
    {
      name: "patient_name",
      type: "text",
      Label: "Patient Name",
      ph: "Enter Patient name",
      value: memoInputs?.patient_name,
    },
    {
      name: "doctor_name",
      type: "text",
      Label: "Doctor Name",
      ph: "Enter Doctor name",
      value: memoInputs?.doctor_name,
    },
    {
      name: "contact",
      type: "number",
      Label: "Phone No",
      ph: "Enter Phone Number",
      value: memoInputs?.contact,
    },
    {
      name: "diagnostics",
      type: "text",
      Label: "Diagnostics",
      ph: "Enter Diagnostics",
      value: memoInputs?.diagnostics,
    },
    {
      name: "address",
      type: "text",
      Label: "Address",
      ph: "Enter Addresss",
      value: memoInputs?.address,
    },
    {
      name: "transaction_id",
      type: "text",
      Label: "Transaction Id",
      ph: "Enter Transaction Id",
      value: memoInputs?.transaction_id,
    },
  ];

  const handleSelectedMedicines = (selectedMedicines: GetMedicines[]) => {
    setMedicines((prev = []) => {
      const updatedMedicines = prev.filter((medicine) =>
        selectedMedicines.some(
          (newMedicine) => newMedicine.batchNo === medicine.batchNo
        )
      );

      // Find new selections that are not already in the previous state
      const newSelected = selectedMedicines.filter((newMedicine) => {
        return !prev.some(
          (medicine) => medicine.batchNo === newMedicine.batchNo
        );
      });

      return [...updatedMedicines, ...newSelected];
    });
  };
  const handleSelectedMedicineQuantity = (
    batchNo: string,
    quantity: number
  ) => {
    setMedicines((prev) =>
      prev?.map((med) =>
        med.batchNo === batchNo
          ? {
              ...med,
              quantity: quantity,
              total_updated_amount: quantity * (med.rate as number),
            }
          : med
      )
    );
  };

  return (
    <ScrollArea className="h-[90vh]">
      <div className="min-h-screen p-5 pt-7">
        <Button type="button" onClick={() => openEdit(false)}>
          Back
        </Button>
        <h1 className="text-[1.4rem] font-md mb-7">Customer Receipt:</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onSubmit(values, medicines, totals)
            )}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-3 max-w-[70vw] gap-5 text-sm my-5">
              {formField.map((fld: any, id) => (
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
                            value={memoId}
                            placeholder={fld.ph}
                            disabled
                          />
                        ) : (
                          <Input
                            className="w-[20vw] font-medium opacity-65"
                            type={fld.type}
                            placeholder={fld.ph}
                            {...field}
                            value={fld.value}
                            onChange={(e) => handlePatientChange(e)}
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
              selectedMedicines={medicines as GetMedicines[]}
              handleSelectedMedicineQuantity={handleSelectedMedicineQuantity}
              handleSelectedMedicines={handleSelectedMedicines}
              totals={totals}
              handleTotals={handleTotals}
            />
            <div className="flex flex-row justify-end items-center gap-2 -mt-14 mr-6">
              <div className="text-xl mb-3 text-red-500 font-semibold">
                <h3>{alertMessage}</h3>
              </div>
              <Button
                type="submit"
                className="hover:text-green-500 m-auto max-w-36"
              >
                {isSubmitting ? "Submitting..." : "Print Memo"}
              </Button>
              <ReactToPrint
                ref={reactToPrintRef}
                content={() => componentRef.current}
                onAfterPrint={() => window.location.reload()}
                documentTitle="Memo"
                pageStyle="print"
              />
            </div>
          </form>
        </Form>

        <div ref={componentRef} className="hidden print:block">
          <CustomerReceipt
            medicines={medicines as GetMedicines[]}
            totals={totals}
            memoDetails={memoDetails}
            memoNo={memoId}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default EditMemo;
