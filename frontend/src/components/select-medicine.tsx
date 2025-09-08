"use client";

import React, { useEffect, useState } from "react";

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const icon = <MdCheckBoxOutlineBlank />;
const checkedIcon = <MdCheckBox />;

import { server } from "@/utils/server";
import { GetMedicines } from "../../../backend/src/shared/types";
import useLoading from "@/hooks/loader.hook"; 

interface selectedMedicineProp {
    selectedMedicines: GetMedicines[],
    handleSelectedMedicines: (newSelectedMedicine: GetMedicines[]) => void;
    stockOnly: boolean;
}
const MedicineListStocked = ({selectedMedicines, handleSelectedMedicines, stockOnly}: selectedMedicineProp) => {
  const [medicines, setMedicines] = useState<GetMedicines[]>([]);

  const isLoading = useLoading();
  useEffect(() => {
    const getMedicines = async () => {
      try {
        const stockOnlyRoute = stockOnly ? "/tableRoute/get-stocked-med" : "/tableRoute/get-all-med"
        const response = await server.get(stockOnlyRoute);
        setMedicines(response.data);
      } catch (error) {
        console.log("Error Fetching Medicines", error);
      }
    };
    getMedicines();
  }, [stockOnly]);

  const defaultMedicines = medicines.filter(med=> selectedMedicines?.some(selectedMed=> selectedMed.batchNo === med.batchNo))
  const handleChange = (newValue: GetMedicines[]) => {
    
    handleSelectedMedicines(newValue); 
  };
  return (
    isLoading ? <p>Autocomplete...</p> :
    <div className='flex flex-row gap-3 items-center'>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={medicines} 
        defaultValue={defaultMedicines}
        defaultChecked={true}
        disableCloseOnSelect  
        getOptionLabel={(option) => option?.batchToMedicine?.medicine_name as string} 
        onChange={(event: any, newValue: GetMedicines[]) =>{
            handleChange(newValue)
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <div className="grid grid-cols-2 gap-4">
                <p>{option.batchToMedicine?.medicine_name}</p>
                <p className="text-end">{option.batchNo}</p>
              </div>
              
            </li>
          );
        }}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label="Checkboxes" placeholder="Favorites" />
        )}
      />
    </div>
  );
};

export default MedicineListStocked;
