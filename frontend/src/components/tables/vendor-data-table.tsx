import React, { useCallback, useEffect, useState } from "react";

import { server } from "@/utils/server";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { VendorMasterType } from "../../../../backend/src/shared/types";

import VendorFilter from "../filters/vendor-filter";
import useLoading from "@/hooks/loader.hook"; 
import { TablePagination } from "@mui/material";
import { ScrollArea } from "../ui/scroll-area";

const VendorDataTable = () => {
  const isLoading = useLoading();
  const header = [
    "SlNo.",
    "Id",
    "Wholesaler",
    "Address",
    "Phone",
    "Email",
    "DL No",
    "GSTIN",
    "Order Ids",
  ];

  const [vendors, setVendors] = useState<VendorMasterType[]>([]);

  const [filteredData, setFilteredData] = useState<VendorMasterType[]>([]);

  const handleFilterData = useCallback((filteredData: VendorMasterType[]) => {
    setFilteredData(() => [...filteredData]);
  }, []);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await server.get(`/vendorRoute/get-vendor`);
        setVendors(response.data);
      } catch (error) {
        console.log("Error fetching medicines:", error);
      }
    };
    getLogs();
  }, [isLoading]);

  useEffect(() => {
    setFilteredData(vendors);
  }, [vendors]);
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
      <div className="grid grid-rows-[.2fr_.8fr] min-w-full p-5 gap-2">
        <div className="grid grid-rows-[.1fr_.9fr] text-[1rem] bg-[#9ba8b3] p-4 rounded-lg">
          <div>
            <h2>Filter</h2>
          </div>
          <div className="grid grid-cols-[1fr_.1fr] bg-[#9ba8b3] rounded-lg items-center">
            <VendorFilter
              vendors={vendors}
              handleFilterData={handleFilterData}
            />
          </div>
        </div>
        <div className="p-2 mb-14 min-w-[70%]">
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((ven, key) => (
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
                            <p className="text-[12px]">{ven.vendorMasterId}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className="text-[12px]">{ven.vendor_name}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black "
                            align="left"
                          >
                            <p className=" text-[12px]">{ven.address}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{ven.phone_no}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{ven.email}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{ven.dl_no}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            <p className=" text-[12px]">{ven.gstin}</p>
                          </TableCell>
                          <TableCell
                            className="border-2 border-black"
                            align="left"
                          >
                            {ven.vendor_invoices?.map((inv, key) => (
                              <p key={key} className=" text-[12px] pb-1">
                                {inv.invoice_No}
                              </p>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                ) : (
                  <div className="text-md font-medium p-5">
                    No Vendor Found
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

export default VendorDataTable;
