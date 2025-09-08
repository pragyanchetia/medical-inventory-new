import React, { useCallback, useEffect, useRef, useState } from "react";

import { server } from "@/utils/server";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import TablePagination from '@mui/material/TablePagination';

import { MemoPricesType } from "../../../../backend/src/shared/types";
import SellsFilter from "../filters/sells-filter"; 
import useLoading from "@/hooks/loader.hook"; 
import ExportTable from "../export";
import { ScrollArea } from "../ui/scroll-area";

type mostSellingType = {
  name: string,
  quantity: number,
}
const SellsDataTable = () => {
  const isLoading = useLoading();
  const header = [
    "SlNo.",
    "Memo",
    "Particulars",
    "Batch No",
    "Expiry",
    "Qty",
    "Rate",
    "GST",
    "Disc",
    "Total",
    "Buyer Name",
    "Patient Name",
    "Date",
  ];

  const [sells, setSells] = useState<MemoPricesType[]>([]);

  let [totalStocks, setTotalStocks] = useState(0);
  let totalStocksRef = useRef<number>(totalStocks)
  const [filteredData, setFilteredData] = useState<MemoPricesType[]>([]);

  const handleFilterData = useCallback((filteredData: MemoPricesType[]) => {
    setFilteredData(() => [...filteredData]);
  }, []);
 
  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await server.get(`/memoRoute/get-sells`);
        setSells(response.data);
      } catch (error) {
        console.log("Error fetching sells. Error:", error);
      }
    };
    getLogs();
  }, [isLoading]);
  
  useEffect(() => {
    const handleInitialFilterOptions = () => {
      setFilteredData(sells);
    }

    handleInitialFilterOptions();

  }, [sells]);
 
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  const handlePageChange = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  }

  const totalStockSold = filteredData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.quantity
  }, 0);

  const totalSellsAmount = filteredData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.total_price
  }, 0);

  const totalSellsAmountFixed = parseFloat(totalSellsAmount.toFixed(2));
  
  let mostSelling: mostSellingType[] = [];

  
  filteredData.map((med, key) => {
    const existingMed = mostSelling.find(item => item.name === med.medicine_name);
    
    if (existingMed) {
      existingMed.quantity += med.quantity;
    } else {
      mostSelling.push({ name: med.medicine_name, quantity: med.quantity });
    }
  });
  
  mostSelling.sort().reverse();

  return (
    <ScrollArea className="h-[90vh]">
    <div className="grid grid-rows-[.2fr_.8fr] min-w-full">
    <div className="grid grid-cols-2 gap-4 text-[1rem]">
      <div className="grid grid-rows-[.1fr_.8fr_.1fr] bg-[#9ba8b3] p-4 mt-7 ml-4 pb-0 rounded-lg gap-3">
        <div>
          <h2>Search Medicine</h2>
        </div>
     <SellsFilter logs={sells} handleFilterData={handleFilterData} /> 
     <div className="flex flex-row pr-4 gap-3 mb-4 justify-start bg-[#9ba8b3] rounded-lg items-center">
            <ExportTable data={filteredData} tableType="sells" />    
          </div>
      </div>

      <div className="grid grid-rows-[.1fr_1fr] bg-[#9ba8b3] p-4 my-7 mr-4 rounded-lg">
        <div>
          <h2>Logistics</h2>
        </div>
        <div className="grid grid-cols-[.4fr_.6fr] gap-3 py-4 pb-0 px-2 pl-0">
          <div className="bg-slate-300 rounded-sm p-2">
            <h2 className="text-[15px]">Total Item Sold: <span className="block text-3xl p-1">{totalStockSold}</span></h2>
            <h2 className="text-[15px]">Total Sells: <span className="block text-3xl p-1">{totalSellsAmountFixed}</span></h2>
          </div>
          <div className="bg-slate-300 rounded-sm p-2">
            <h2>Most Sellings: </h2>
            <ScrollArea>
            {mostSelling.map((item, key) => (
              <div
                className="grid grid-cols-[.1fr_.8fr_.1fr] text-[13px] border-y-[1.3px] border-slate-200 pr-2"
                key={key}
              >
                <p className=" pl-2 py-1">{key + 1}</p>
                <p className=" pl-2 py-1 text-start">
                  {item.name}
                </p>
                <p className=" pl-2 py-1 text-start">{item.quantity}</p>
              </div>
            ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>    
      <div className="p-2 mb-14 min-w-[70%]">
        {
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="border-2 border-black">
                  {header.map((head, key) => (
                    <TableCell
                      className="border-l-2 border-black"
                      key={key}
                    >
                      <p className="flex justify-center font-bold text-[12px]">
                        {head}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {isLoading ? (
                <p className="ml-5 text-md font-medium mt-2">Loading...</p>
              ) : filteredData.length > 0 ? (
                <TableBody className="border-2 border-black">
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sell, key) => (
                    <TableRow
                      key={key}
                      sx={{
                        "&:last-child td, &:last-child th": {},
                      }}
                    >
                      <TableCell
                        className="border-2 border-black"
                        align="center"
                      >
                        <p className="text-[12px]">{key + 1}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className="text-[12px]">
                        {sell.memoPriceToMaster?.memoNo}
                        </p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className="text-[12px]">{sell.medicine_name}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className="text-[12px]">{sell.batchNo}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black "
                        align="left"
                      >
                        <p className=" text-[12px]">
                          {sell.expiry?.split("-").reverse().join("-")}
                        </p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">{sell.quantity}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">{sell.rate}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">{sell.gst}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">{sell.discount}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">{sell.total_price}</p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">
                          {sell.memoPriceToMaster?.buyer_name}
                        </p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">
                          {sell.memoPriceToMaster?.patient_name}
                        </p>
                      </TableCell>
                      <TableCell
                        className="border-2 border-black"
                        align="left"
                      >
                        <p className=" text-[12px]">
                          {sell.memoPriceToMaster?.memoDate?.split("-").reverse().join("-")}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div className="text-md font-medium p-5">
                  No Sells Found
                </div>
              )}
            </Table>
          </TableContainer>
        }
        <TablePagination
              rowsPerPageOptions={[6, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
      </div>
    </div>
    </ScrollArea>
  );
};

export default SellsDataTable;
