"use client";
import React, { useCallback, useEffect, useState } from "react";

import { server } from "@/utils/server";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { InvoicePricesType } from "../../../../backend/src/shared/types";
import PurchaseFilter from "../filters/purchase-filter";
import useLoading from "@/hooks/loader.hook";
import { TablePagination } from "@mui/material";
import ExportTable from "../export"; 
import { ScrollArea } from "../ui/scroll-area";

const PurchaseDataTable = () => {
  const isLoading = useLoading();
  const header = [
    "SlNo.",
    "Particular",
    "Batch No",
    "Qty",
    "MRP",
    "Rate",
    "Disc",
    "Gst",
    "Total",
    "Expiry",
    "Invoice Id",
    "Invoice Date",
    "vendor",
  ];

  const [purchases, setPurchases] = useState<InvoicePricesType[]>([]);

  const [filteredData, setFilteredData] = useState<InvoicePricesType[]>([]);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await server.get(`/invoiceRoute/get-purchases`);
        setPurchases(response.data);
      } catch (error) {
        console.log("Error fetching sell details. Error:", error);
      }
    };
    getLogs();
  }, [isLoading]);

  useEffect(() => {
    setFilteredData(purchases);
  }, [purchases]);

  const handleFilterData = useCallback((filteredData: InvoicePricesType[]) => {
    setFilteredData(() => [...filteredData]);
  }, []);

  let totalPurchaseQuantity = filteredData.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.quantity;
    },
    0
  );

  let totalPurchaseAmount = filteredData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.total_med_amount;
  }, 0);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  const handlePageChange = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <ScrollArea className="h-[90vh]">
      <div className="grid grid-rows-[.2fr_.8fr] min-w-full p-5 pt-3 gap-2">
        <div className="grid grid-cols-2 gap-4 text-[1rem]">
          <div className="grid grid-rows-[.1fr_.8fr_.1fr] bg-[#9ba8b3] p-4 my-7 ml-4 rounded-lg gap-3">
            <div>
              <h2>Search Medicine</h2>
            </div>
            <PurchaseFilter
              logs={purchases}
              handleFilterData={handleFilterData}
            />
                <div className="flex flex-row pr-4 gap-3 justify-start bg-[#9ba8b3] rounded-lg items-center">
              <ExportTable data={filteredData} tableType="purchase" />    
            </div>
          </div>

          <div className="grid grid-rows-[.1fr_1fr] min- h-fit bg-[#9ba8b3] p-4 my-7 mr-4 rounded-lg">
            <div>
              <h2>Logistics</h2>
            </div>
            <div className="grid grid-cols-[.4fr_.6fr] gap-3 py-4 pb-0 px-2 pl-0">
              <div className="bg-slate-300 h-fit rounded-sm p-2">
                <h2 className="text-[15px]">
                  Total Purchase Quantity:{" "}
                  <span className="block text-3xl p-1">
                    {totalPurchaseQuantity}
                  </span>
                </h2>
                <h2 className="text-[15px]">
                  Total Purchase Amount:{" "}
                  <span className="block text-3xl p-1">
                    {totalPurchaseAmount}
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>

      <div className="w-full overflow-x-scroll min-h-[70vh] overflow-y-hidden">
        
        <div className="p-2 mb-14 w-[125%]">
          {
            <TableContainer className="">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow className="border-2 border-black">
                    {header.map((head, key) => (
                      <TableCell className="border-l-2 border-black" key={key}>
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
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((purchase, key) => (
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
                        <TableCell className="border-2 border-black" align="left">
                          <p className="text-[12px]">{purchase.medicine_name}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className="text-[12px]">{purchase.batchNo}</p>
                        </TableCell>
                        <TableCell
                          className="border-2 border-black "
                          align="left"
                        >
                          <p className=" text-[12px]">{purchase.quantity}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">{purchase.mrp}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">{purchase.rate}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">{purchase.discount}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">{purchase.gst}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">
                            {purchase.total_med_amount}
                          </p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">{purchase.expiry?.split("-").reverse().join("-")}</p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">
                            {purchase.invoicePriceToMaster?.invoice_No}
                          </p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">
                            {purchase.invoicePriceToMaster?.invoice_date?.split("-").reverse().join("-")}
                          </p>
                        </TableCell>
                        <TableCell className="border-2 border-black" align="left">
                          <p className=" text-[12px]">
                            {
                              purchase.invoicePriceToMaster?.invoiceToVendor
                                ?.vendor_name
                            }
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <div className="text-md font-medium p-5">No Purchase Found</div>
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
      </div>
    </ScrollArea>
  );
};

export default PurchaseDataTable;
