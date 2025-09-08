"use client";

import React, { useState } from "react"; 
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
import { server } from "@/utils/server";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  medicine_name: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  pack: z.string({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  mfgBy: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  batchNo: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  quantity: z.coerce.number({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  location: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  mrp: z.coerce.number({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  rate: z.coerce.number({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  gst: z.coerce.number({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  discount: z.coerce.number({message: "This field is required!"}).min(1, { message: "This field is Required!" }),
  expiry: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date"
            ? "This field is Required!"
            : defaultError,
      }),
    })
    .min(new Date(), { message: "Expiry Date must be in future!" }),
});

const defaultValues = {
  medicine_name: "",
  pack: "",
  mfgBy: "",
  batchNo: "",
  quantity: parseInt(""),
  location: "",
  mrp: parseInt(""),
  rate: parseInt(""),
  gst: parseInt(""),
  discount: parseInt(""),
  expiry: new Date(), 
};


const MedicineForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>(""); 

  const alertWindow = (message: string) => {
    setAlertMessage(message); 
    setTimeout(()=> setAlertMessage(""), 2000);
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true); 

    const date = values.expiry.toISOString().substring(0, 10);

    const data = {
      ...values,
      expiry: date,
    };
    try { 
      await server.post(
        `/tableRoute/add-new-med`,
        data
      ).then((res) => {
        alertWindow(res.data.message || "Error Creating Medicines");
        if (res.status === 201) {
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
      name: "medicine_name",
      type: "text",
      Label: "Medicine Name",
      ph: "Enter medicine name",
    },
    { name: "pack", type: "text", Label: "Pack (gm|ml)", ph: "Enter pack" },
    { name: "mfgBy", type: "text", Label: "MFG by", ph: "Enter mfg" },
    { name: "batchNo", type: "text", Label: "Batch No", ph: "Enter batch no" },
    {
      name: "quantity",
      type: "number",
      Label: "Quantity",
      ph: "Enter quantity",
    },
    {
      name: "location",
      type: "text",
      Label: "Location",
      ph: "Enter Location",
    },
    { name: "mrp", type: "number", Label: "MRP (Rs)", ph: "Enter mrp" },
    { name: "rate", type: "number", Label: "Rate (Rs)", ph: "Enter rate" },
    { name: "gst", type: "number", Label: "GST (%)", ph: "Enter gst" },
    {
      name: "discount",
      type: "number",
      Label: "discount (%)",
      ph: "Enter discount",
    },
    { name: "expiry", type: "date", Label: "Expiry Date", ph: "" },
  ];

  return (
    <Form {...form}> 
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-start ml-7 mt-4"
      >
        <div className="text-xl mb-3 text-red-500 font-semibold">
          <h3>{alertMessage}</h3>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {formField.map((fld, id) => (
            <FormField
              control={form.control}
              key={id}
              name={fld.name as never}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fld.Label}</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[20vw] font-medium"
                      type={fld.type}
                      placeholder={fld.ph}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))} 
        </div>

        <Button type="submit" className="hover:text-green-500 mt-5 mb-9 max-w-[25vh]">
          {isSubmitting ? "Submitting..." : "Add Medicine"}
        </Button>
      </form>
    </Form>
  );
};

export default MedicineForm;
