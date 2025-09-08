"use client";

import React, { Suspense, useCallback, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { jwtDecode } from "jwt-decode";

import { useEffect } from "react";
import { server } from "@/utils/server";
import { MemoMasterType } from "../../../../backend/src/shared/types";
import useLoading from "@/hooks/loader.hook";
import Loader from "../loader";
import { TablePagination } from "@mui/material";
import { FilePenLine } from "lucide-react";
import { Button } from "../ui/button";
import MemoFilter from "../filters/memo-filter";
import EditMemo from "../blocks/edit-memo";
import { ScrollArea } from "../ui/scroll-area";

const Memos = () => {
  const isLoading = useLoading();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const fetchUser = async () => {
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
    };
    fetchUser();
  }, []);

  const header = [
    "Sl No",
    "Memo No",
    "Patient",
    "Phone No",
    "Address",
    "diagnostics",
    "Doctor",
    "Date",
    "Discount",
    "Gst",
    "Total",
    "Edit",
  ];

  const [memo, setMemo] = useState<MemoMasterType[]>([]);

  const [filteredData, setFilteredData] = useState<MemoMasterType[]>([]);

  const handleFilterData = useCallback((filteredData: MemoMasterType[]) => {
    setFilteredData(() => [...filteredData]);
  }, []);

  const [editMemo, setEditMemo] = useState<boolean>(false);
  const [editMemoId, setEditMemoId] = useState<string>("");
  const openEdit = useCallback((isTrue: boolean) => {
    setEditMemo(isTrue);
  }, []);

  useEffect(() => {
    const getMemos = async () => {
      try {
        const response = await server.get(`/memoRoute/get-memos`);
        setMemo(response.data);
      } catch (error) {
        console.log("Error fetching medicines.\nError:", error);
      }
    };
    getMemos();
  }, [editMemo]);

  useEffect(() => {
    setFilteredData(memo);
  }, [memo]);

  //pagination:
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
      {editMemo ? (
        <EditMemo openEdit={openEdit} memoId={editMemoId} />
      ) : (
        <Suspense fallback={<Loader />}>
          <div className="grid grid-rows-[.2fr_.8fr] min-w-fit p-5 gap-2">
            <div className="grid grid-rows-[.1fr_.9fr] text-[1rem] bg-[#9ba8b3] p-4 rounded-lg">
              <div>
                <h2>Search</h2>
              </div>
              <MemoFilter memo={memo} handleFilterData={handleFilterData} />
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
                        {filteredData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((memo, key) => (
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
                                  <p className="text-[12px]">{memo.memoNo}</p>
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className="text-[12px]">
                                  {memo.patient_name}
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className="text-[12px]">{memo.contact}</p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black "
                                align="left"
                              >
                                <p className=" text-[12px]">{memo.address}</p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className=" text-[12px]">
                                  {memo.diagnostics}
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className=" text-[12px]">
                                  {memo.doctor_name}
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className=" text-[12px]">
                                  {memo.memoDate
                                    ?.split("-")
                                    .reverse()
                                    .join("-")}
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="right"
                              >
                                <p className=" text-[12px]">
                                  {memo.total_discount}
                                </p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className=" text-[12px]">{memo.total_gst}</p>
                              </TableCell>
                              <TableCell
                                className="border-2 border-black"
                                align="left"
                              >
                                <p className=" text-[12px]">
                                  {memo.grand_total}
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
                                    className=" hover:text-green-400"
                                    onClick={() => {
                                      openEdit(!editMemo);
                                      setEditMemoId(memo.memoNo);
                                    }}
                                  >
                                    <FilePenLine width={12} height={12} />
                                  </Button>
                                ) : (
                                  <p className="text-[12px]">...admin</p>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    ) : (
                      <div className="text-md font-medium p-5">
                        No Memo Found
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
        </Suspense>
      )}
    </ScrollArea>
  );
};

export default Memos;
