import VendorForm from "@/components/forms/vendor-form";
import React from "react";

const AddVendor = () => {
  return (
    <div className="max-h-screen  p-5 pt-7">
      <h1 className="text-[1.4rem] font-md mb-7">Create Wholesaler:</h1>
      <VendorForm />
    </div>
  );
};

export default AddVendor;
