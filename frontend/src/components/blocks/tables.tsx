'use client'
import React, { useEffect, useState } from "react";

import SelectTable from "../select-table";
import Loader from "../loader"; 
import MedicineDataTable from "../tables/medicine-data-table";
import VendorDataTable from "../tables/vendor-data-table";
import PurchaseDataTable from "../tables/purchase-data-table";
import SellsDataTable from "../tables/sells-data-table";   
import Memos from "../tables/memo-data-table";
import { tableTypes } from "../../../../backend/src/shared/types";


const DataTables = () => {
  const [table, setTable] = useState<string>(tableTypes.memos);

  const handleTableChange = (value: string) => {
    sessionStorage.setItem("navTableState", value);
    setTable(value);
  };

  useEffect(()=> {
    const savedComponent = sessionStorage.getItem("navTableState");
    setTable(savedComponent || tableTypes.medicineTable);
  }, []);
  
  return (
    <div className="flex flex-row ">
      <div className="bg-[#405D72]">
        <SelectTable handleTableChange={handleTableChange} table={table} />
      </div> 
      <div className="w-full"> 
          {table === tableTypes.medicineTable ? (
              <MedicineDataTable />
          ) : table === tableTypes.vendorTable ? (
              <VendorDataTable />
          ) : table === tableTypes.purchaseTable ? (
              <PurchaseDataTable /> 
          ) : table === tableTypes.sellsTable ? (
              <SellsDataTable /> 
          ) : 
          table === tableTypes.memos ? (
              <Memos />
          ) : 
          (
            <Loader />
          )} 
      </div>
    </div>
  );
};

export default DataTables;
