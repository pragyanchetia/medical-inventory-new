
"use client";

import React, { useEffect } from "react";

import { Input } from "@/components/ui/input"; 
import { GetMedicines } from "../../../../backend/src/shared/types";
import { ScrollArea } from "@/components/ui/scroll-area";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TotalsProps } from "../blocks/create-invoice"; 
import MedicineListStocked from "../select-medicine";

//here type changes
export interface MedicineSelected extends GetMedicines {
  selected: boolean;
}

interface MedicinesBillProps {
  stockOnly: boolean;
  totals: TotalsProps;
  selectedMedicines: GetMedicines[];
  handleSelectedMedicineQuantity: (batchNo: string, quantity: any) => void;
  handleSelectedMedicines: (selectedMedicines: GetMedicines[]) => void;
  handleTotals: (gross: number, gt: number, td: number, gst: number, tq: number) => void;
}

const InvoiceBillingForm: React.FC<MedicinesBillProps> = ({
  stockOnly,
  selectedMedicines,
  handleSelectedMedicineQuantity,
  handleSelectedMedicines,
  handleTotals,
  totals,
}) => {
  //Table Headers:
  const header = [
    "Particulars",
    "Pack",
    "HSN",
    "MFG By",
    "Batch No",
    "Expiry",
    "Qty",
    "MRP",
    "Rate",
    "Disc %",
    "GST %",
    "Amount",
  ]; 

  //calculation final prices: Update: value update function
  useEffect(() => {
    const updateTotals = () => {
      const totalDiscount = selectedMedicines?.reduce((acc, curr) => acc + curr.discount, 0)/selectedMedicines?.length;
      const totalGst= selectedMedicines?.reduce((acc, curr) => acc + curr.gst, 0)/selectedMedicines?.length;
      const grossPrice= selectedMedicines?.reduce((acc, curr) => acc + curr.total_updated_amount, 0);
      const grandTotal= (grossPrice + totalGst) - totalDiscount;
      const totalQuantity = selectedMedicines?.reduce((acc, curr)=> acc+curr.quantity, 0);
      
      const discount = Math.floor(totalDiscount *100)/100;
      const gst = Math.floor(totalGst *100)/100;
      const gross = Math.floor(grossPrice *100)/100;
      const grand = Math.floor(grandTotal *100)/100;
      const quantity = Math.floor(totalQuantity *100)/100;
      
      handleTotals(gross, grand, discount, gst, quantity);
    };

    updateTotals();
  }, [
    handleTotals,
    selectedMedicines,
    totals.grandTotal,
    totals.grossPrice,
    totals.totalDiscount,
    totals.totalGst,
    totals.total_quantity
  ]);

  return (
    <div className="grid grid-rows-[.5fr_.7fr_.3fr] gap-4 w-full">

      <MedicineListStocked stockOnly={stockOnly} selectedMedicines={selectedMedicines as GetMedicines[]} handleSelectedMedicines={handleSelectedMedicines}/>

      <ScrollArea
        id="select"
        className="w-full h-[60vh] rounded-md p-4 bg-[#b4d1dd]"
      >
        {
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {header.map((head, key) => (
                    <TableCell key={key}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {selectedMedicines?.length > 0 ? (
                <TableBody>
                  {selectedMedicines.map((med, key) => (
                    <TableRow
                      key={key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="med">
                        {med?.batchToMedicine?.medicine_name}
                      </TableCell>
                      <TableCell align="right">{med.batchToMedicine?.pack}</TableCell>
                      <TableCell align="right">{med.batchToMedicine?.hsnCode}</TableCell>
                      <TableCell align="right">{med.batchToMedicine?.mfgBy}</TableCell>
                      <TableCell align="right">{med.batchNo}</TableCell>
                      <TableCell align="right">{med.expiry?.split("-").reverse().join("-")}</TableCell>
                      <TableCell align="right">
                        <Input
                          type="number"
                          key={med.batchNo}
                          placeholder="qty"
                          min={0}  
                          className="max-w-[6vw]"
                          value={med.quantity}
                          onChange={(e) => 
                            handleSelectedMedicineQuantity(med.batchNo, e.target.valueAsNumber)
                          }
                        />
                      </TableCell>
                      <TableCell align="right">{med.mrp}</TableCell>
                      <TableCell align="right">{med.rate}</TableCell>
                      <TableCell align="right">{med.discount}</TableCell>
                      <TableCell align="right">{med.gst}</TableCell>
                      <TableCell align="right">{med.total_updated_amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div className="text-md font-medium p-5">Nothing Selected</div>
              )}
            </Table>
          </TableContainer>
        }
      </ScrollArea>

      <div className="max-w-[100vw] flex flex-row justify-end">
        <div className="w-[35%] text-start text-lg rounded-md bg-[#b4d1dd] p-7 pl-12">
          <h1 className="py-1">Gross: &#8360; {totals.grossPrice}</h1>
          <h1 className="py-1">Discount: &#8360; {totals.totalDiscount}</h1>
          <h1 className="py-1">GST: &#8360; {totals.totalGst}</h1>
          <h1 className="py-1 text-[1.3rem] text-teal-600">
            Grand Total: &#8360; {totals.grandTotal}
          </h1>
        </div>
      </div>
    </div>
  );
};
export default InvoiceBillingForm;
