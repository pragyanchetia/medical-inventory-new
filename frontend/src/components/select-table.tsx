import React from "react"; 
import { Button } from "./ui/button"; 
import { cn } from "@/lib/utils";
import { tableTypes } from "../../../backend/src/shared/types";

interface tableSetterProp {
    table: string | undefined,
    handleTableChange: (value: string) => void
}
const SelectTable = ({table, handleTableChange}: tableSetterProp) => {

  const tables = [
    {header: "Medicines Inventory", type: tableTypes.medicineTable},
    {header: "Vendors", type: tableTypes.vendorTable},
     {header: "Buys", type:  tableTypes.purchaseTable},
     {header: "Sells", type: tableTypes.sellsTable},
     {header: "memos", type:  tableTypes.memos}
  ];

  const btnStyles = "bg-white rounded-none text-black hover:bg-green-400 flex flex-col text-start items-start max-h-[30px]";

   const selectedStyle = "bg-green-400 text-[#122936] font-semibold";
  return (
    <div className="flex flex-col mt-6 mx-4 min-w-44">
      <h1 className="py-2 pb-1 pl-0 text-[#efefef] text-[1.13rem]">Tables</h1> 
        <div className="flex flex-col gap-1 mt-3">
          {tables.map((med, key) => (
            <Button
              className={cn('p-4 pr-6',
                table === med.type ? `${btnStyles} ${selectedStyle} ` : btnStyles
              )}
              key={key}
              onClick={() => {
                handleTableChange(med.type)
              }}
            >
              {med.header}
            </Button>
          ))}
        </div> 
    </div>
  );
};

export default SelectTable;
