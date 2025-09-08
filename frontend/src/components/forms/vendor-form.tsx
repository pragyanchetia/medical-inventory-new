 "use client";

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
import React, { useState } from "react";
import { server } from "@/utils/server";

const formSchema = z.object({
  vendorMasterId: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  vendor_name: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  address: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  phone_no: z.coerce.number({required_error: "This field is required!", invalid_type_error: "This field is required!"}).min(1, { message: "This field is Required!"}),
  dl_no: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }),
  gstin: z.string({required_error: "This field is required!"}).min(1, { message: "This field is Required!" }), 
});

const defaultValues = {
  vendorMasterId: "",
  vendor_name: "",
  address: "",
  phone_no: parseInt(""),
  dl_no: "",
  gstin: "",
};

const VendorForm = () => {
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
    try { 
      await server.post(
        `/vendorRoute/add-vendor`,
        values
      ).then((res)=> {
          alertWindow(res.data.message || "Error Creating Vendor");
          if (res.status === 201) {
            form.reset(defaultValues);
          }
      });
 
    } catch (error: any) {   
      alertWindow(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);  
    }
  };

  const formField = [
    {
      name: "vendorMasterId",
      type: "text",
      Label: "Enter wholsaler Id",
      ph: "Enter wholesaler Id",
    },
    {
      name: "vendor_name",
      type: "text",
      Label: "wholesaler Name",
      ph: "Enter wholesaler Name",
    },
    { name: "address", type: "text", Label: "Address", ph: "Enter wholesaler Address" },
    {
      name: "phone_no",
      type: "number",
      Label: "Phone Number",
      ph: "Enter wholesaler Phone Number",
    },
    { name: "dl_no", type: "text", Label: "D.L.No.", ph: "Enter wholesaler D.L.No." },
    { name: "gstin", type: "text", Label: "GSTIN", ph: "Enter wholesaler GSTIN" },
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
        <div className="grid grid-cols-2 gap-y-4 gap-x-9">
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
        <Button
          type="submit"
          className="my-9 hover:text-green-500 max-w-[25vh]"
        >
          {isSubmitting ? "Submitting..." : "Add Vendor"}
        </Button>
      </form>
    </Form>
  );
};

export default VendorForm;
