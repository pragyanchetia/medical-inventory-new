import MedicineForm from "@/components/forms/medicine-form";
import React from "react";

const AddNewMedicines = () => {
  return (
    <div className="max-h-screen p-5 pt-7">
      <h1 className="text-[1.4rem] font-md mb-7">Create Medicine:</h1>
      <MedicineForm />
    </div>
  );
};

export default AddNewMedicines;
