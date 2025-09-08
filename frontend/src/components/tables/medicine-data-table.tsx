import React, { useCallback, useEffect, useState } from "react";
import { MedicinesType } from "../../../../backend/src/shared/types";
import { server } from "@/utils/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MedicineFilter from "../filters/medicines-filter";
import useLoading from "@/hooks/loader.hook"; 
import { TablePagination } from "@mui/material";
import ExportTable from "../export";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { ScrollArea } from "../ui/scroll-area";

const MedicineDataTable = () => {
  const isLoading = useLoading();
  const header = [
    "SlNo.",
    "Particulars",
    "Batch No",
    "mfgBy",
    "Pack",
    "HSN",
    "Qty",
    "Location",
    "MRP",
    "Rate",
    "Total Price",
    "Exp",
    "Delete",
  ];

  const [medicines, setMedicines] = useState<MedicinesType[]>([]);

  const [filteredData, setFilteredData] = useState<MedicinesType[]>([]);

  const handleFilterData = useCallback((filteredData: MedicinesType[]) => {
    setFilteredData(() => [...filteredData]);
  }, []);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await server.get(`/tableRoute/get-all-med`);
        setMedicines(response.data);
        try {
          const decodedToken: any = jwtDecode(
            localStorage.getItem("token") as string
          );
          if (decodedToken.role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Not Admin!", error);
        }
      } catch (error) {
        console.log("Error fetching medicines:", error);
      }
    };
    getLogs();
  }, [isLoading]);

  useEffect(() => {
    setFilteredData(medicines);
  }, [medicines]);

  let totalStock = filteredData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.quantity;
  }, 0);

  let totalAmount = filteredData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.total_amount;
  }, 0);

  let lowStockItems = filteredData.filter((med) => {
    return med.quantity < 5;
  });

  const today = new Date();
  const date = new Intl.DateTimeFormat("en-GB").format(today);

  const currentYear = parseInt(date.substring(6));
  const currentMonth = parseInt(date.substring(3));
  let expireSoonItems = filteredData.filter((med) => {
    return (
      parseInt(med.expiry) === currentYear &&
      parseInt(med.expiry.substring(5)) - currentMonth === 1
    );
  });

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

  const [quantity, setQuantity] = useState<number>();
  const [updatedQuantity, setUpdatedQuantity] = useState<number>(0);
  const [update, setUpdate] = useState<string>("");

  const [alertMessage, setAlertMessage] = useState<string>(""); 

  const alertWindow = (message: string) => {
    setAlertMessage(message); 
    setTimeout(()=> setAlertMessage(""), 2400);
  }
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuantity(event.currentTarget.valueAsNumber);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    batchNo: string,
    rate: number
  ) => {
    event.preventDefault();
    const data = {
      stockInt: quantity,
      rate: rate,
      batchNo: batchNo,
    };
    try {
      setUpdate(batchNo);
      await server.post("/tableRoute/add-med-stock", data).then((res) => 
        alertWindow(res.data.message || "Error Adding Stock!")
      ).finally(()=> {
        setUpdatedQuantity(data.stockInt as number);
      });
      
    } catch (error: any) {
      if (error) { 
        alertWindow(error.response?.data?.message);
      }
    }
  };

  const [removeDeleted, setRemovedDeleted] = useState<string[]>([""]);  
  const [shouldDelete, setShouldDelete] = useState<boolean>(false);
  const [deleteBatchNo, setDeleteBatchNo] = useState<string>("");
  let confirm = false;
  const handleDelete = async (batchNo: string) => { 
    const data = { 
      batchNo: batchNo,
    };
    try {
      await server.delete(
        "/tableRoute/delete-batch", {data}
      ).then((res)=> console.log(res.data.message || "Error Updating Memo")).finally(()=> {
        setRemovedDeleted((prev) => [...prev, batchNo]);
      });
      
    } catch (error: any) {
      if (error) {
        console.log(error);
        console.log(error.response?.data?.message);
      }
    }
  };

  return (
    <ScrollArea className="h-[90vh]">
      <div className="grid grid-rows-[.2fr_.2fr_.6fr] min-w-full p-5 gap-2">
        {/* Logistics: */}
        <div className="grid grid-rows-[.1fr_1fr] text-[1rem] bg-[#9ba8b3] p-4 rounded-lg">
          <div>
            <h2 className="mb-2">Logistics</h2>
          </div>
          <div className="grid grid-cols-[.3fr_.4fr_.4fr] gap-3">
            <div className="bg-slate-300 rounded-sm p-2">
              <h2 className="text-[16px]">
                Total Stock:{" "}
                <span className="block text-3xl p-1">{totalStock}</span>
              </h2>
              <h2 className="text-[16px]">
                Total Stock Amount:{" "}
                <span className="block text-3xl p-1">{totalAmount}</span>
              </h2>
            </div>
            <div className="bg-slate-300 rounded-sm p-2">
              <h2 className="mb-2">Low On Stock: </h2>
              <ScrollArea>
                {lowStockItems.map((lowStockItem, key) => (
                  <div
                    className="grid grid-cols-[.1fr_.8fr_.1fr] text-[13px] text-red-500 border-y-[1.3px] border-slate-200 pr-2"
                    key={key}
                  >
                    <p className=" pl-2 py-1">{key + 1}</p>
                    <p className=" pl-2 py-1">
                      {lowStockItem.batchToMedicine?.medicine_name}
                    </p>
                    <p className=" pl-2 py-1">{lowStockItem.quantity}</p>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="bg-slate-300 rounded-sm p-2">
              <h2 className="mb-2">Expired next month: </h2>
              <ScrollArea>
                {expireSoonItems.sort((x, y) => x.batchToMedicine?.medicine_name.localeCompare(y.batchToMedicine?.medicine_name)).map((items, key) => (
                  <div
                    className="grid grid-cols-[.1fr_.7fr_.2fr] text-[13px] text-red-500 border-y-[1.3px] border-slate-200 pr-2"
                    key={key}
                  >
                    <p className=" pl-2 py-1">{key + 1}</p>
                    <p className=" pl-2 py-1">
                      {items.batchToMedicine?.medicine_name}
                    </p>
                    <p className="py-1">
                      {items.expiry
                        ?.split("-")
                        .reverse()
                        .join("-")
                        .substring(3)}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-rows-[.1fr_.9fr] text-[1rem] bg-[#9ba8b3] p-4 rounded-lg">
          <div>
            <h2>Filter</h2>
          </div>
          <div className="grid grid-cols-[1fr_.1fr] bg-[#9ba8b3] rounded-lg items-center">
            <MedicineFilter
              meds={medicines}
              handleFilterData={handleFilterData}
            />
            <ExportTable data={filteredData} tableType="inventory" />
          </div>
        </div>

        {/* table */}
        <div className="mb-14 min-w-[80%]">
          {
            <TableContainer>
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
                    {filteredData
                     .filter((med) => !removeDeleted.includes(med.batchNo))
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((med, key) => (
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
                              {med.batchToMedicine?.medicine_name}
                            </p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className="text-[12px]">{med.batchNo}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black "
                            align="left"
                          >
                            <p className=" text-[12px]">
                              {med.batchToMedicine?.mfgBy}
                            </p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black "
                            align="left"
                          >
                            <p className=" text-[12px]">
                              {" "}
                              {med.batchToMedicine?.pack}
                            </p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">
                              {med.batchToMedicine?.hsnCode}
                            </p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="center"
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger className="hover:bg-[#bacad6] p-3 rounded-md">
                                <p className="text-[12px]">{(med.batchNo === update) ? med.quantity + updatedQuantity : med.quantity}</p>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>
                                  Add Medicine
                                  <div className="text-[14px] mb-3 text-green-500 font-semibold">
                                    <h3>{alertMessage}</h3>
                                  </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="p-2 px-6">
                                  <form
                                    className="flex flex-row justify-center items-center gap-2"
                                    onSubmit={(value) =>
                                      handleSubmit(value, med.batchNo, med.rate)
                                    }
                                  >
                                    <Input
                                      className="max-w-[60%]"
                                      type="number"
                                      min={1}
                                      value={quantity}
                                      required
                                      onChange={handleChange}
                                      placeholder="add value quantity" 
                                    /> 
                                      <Button
                                        className="w-[50px] p-2 text-[23px] font-semibold"
                                        type="submit"
                                      >
                                        +
                                      </Button> 
                                  </form>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{med.location}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{med.mrp}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{med.rate}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{med.total_amount}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">
                              {med.expiry?.split("-").reverse().join("-")}
                            </p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            {!isLoading && isAdmin ? (
                              <Button
                                type="button"
                                size={"sm"}
                                className="text-[#efefef] hover:text-green-400"
                                onClick={() => {
                                  if (deleteBatchNo === med.batchNo) {
                                    if (shouldDelete) {
                                      if (confirm) {
                                        handleDelete(med.batchNo);
                                        setDeleteBatchNo(""); // Reset state after deletion
                                        setShouldDelete(false);
                                      } else {
                                        setDeleteBatchNo(""); // Reset state if canceled
                                      }
                                    }
                                  } else {
                                    // Set the current batchNo to be confirmed
                                    setDeleteBatchNo(med.batchNo);
                                    setShouldDelete(true);
                                  }
                                  }}
                              >
                                {deleteBatchNo === med.batchNo && shouldDelete ? <p onClick={()=> {confirm = true}}>Sure?</p> : <Trash2 width={12} height={12} />}
                              </Button>
                            ) : (
                              <p className="text-[12px]">admin</p>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : (
                  <div className="text-md font-medium p-5">
                    No Medicine Found
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

export default MedicineDataTable;
