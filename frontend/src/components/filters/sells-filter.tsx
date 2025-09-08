"use client";

import React, { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MemoPricesType } from "../../../../backend/src/shared/types";

export type searchTypes = {
  memoNo: string;
  medicineName: string;
  batchNo: string;
  buyerName: string;
  expiry: string;
  sellingDate: string;
};

interface searchProps {
  logs: MemoPricesType[];
  handleFilterData: (filteredData: MemoPricesType[]) => void;
}
const SellsFilter = ({ logs, handleFilterData }: searchProps) => {
  const [tempFilter, setTempFilter] = useState<MemoPricesType[]>([]);

  const handleData = useMemo(
    () => handleFilterData(tempFilter),
    [tempFilter, handleFilterData]
  );

  const [searchParams, setSearchParams] = useState<searchTypes>({
    memoNo: "",
    medicineName: "",
    batchNo: "",
    buyerName: "",
    expiry: "",
    sellingDate: "",
  });
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const updatedParams = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      e.target.name === "memoNo" && updatedParams?.memoNo
        ? setTempFilter(
            logs.filter((lg) =>
              lg.memoPriceToMaster?.memoNo
                ?.toLowerCase()
                .includes(updatedParams?.memoNo.toLowerCase())
            )
          )
        : e.target.name === "batchNo" && updatedParams?.batchNo
        ? setTempFilter(
            logs.filter((lg) =>
              lg.batchNo
                ?.toLowerCase()
                .includes(updatedParams?.batchNo.toLowerCase())
            )
          )
        : e.target.name === "medicineName" && updatedParams?.medicineName
        ? setTempFilter(
            logs.filter((lg) =>
              lg.medicine_name
                ?.toLowerCase()
                .includes(updatedParams?.medicineName.toLowerCase())
            )
          )
        : e.target.name === "buyerName" && updatedParams?.buyerName
        ? setTempFilter(
            logs.filter((lg) =>
              lg.memoPriceToMaster?.buyer_name
                ?.toLowerCase()
                .includes(updatedParams?.buyerName.toLowerCase())
            )
          )
        : e.target.name === "expiry" && updatedParams?.expiry
        ? setTempFilter(
            logs.filter((lg) =>
              lg?.expiry?.includes(updatedParams?.expiry)
            )
          )
        : setTempFilter(logs);

      return updatedParams;
    });
  };
  handleData;
  const filtersInput = [
    {
      name: "memoNo",
      type: "text",
      ph: "Enter Memo No",
      label: "Memo No",
      value: searchParams.memoNo,
    },
    {
      name: "medicineName",
      type: "text",
      ph: "Enter Medicine Name",
      label: "Medicine Name",
      value: searchParams.medicineName,
    },
    {
      name: "batchNo",
      type: "text",
      ph: "Enter Batch No",
      label: "Batch No",
      value: searchParams.batchNo,
    },
    {
      name: "buyerName",
      type: "text",
      ph: "Enter Buyer Name",
      label: "Buyer Name",
      value: searchParams.buyerName,
    },
    {
      name: "expiry",
      type: "date",
      ph: "Enter Expiry Date",
      label: "Expiry Date",
      value: searchParams.expiry,
    },
    {
      name: "sellingDate",
      type: "date",
      ph: "Enter Selling Date",
      label: "Selling Date",
      value: searchParams.sellingDate,
    },
  ];

  return (
    <div className="flex flex-row min-w-full flex-wrap justify-start gap-x-4 mb-2">
      {filtersInput.map((ip, key) => (
        <div className="w-[15vw]" key={key}>
          <Label>{ip.label}</Label>
          <Input
            type={ip.type}
            placeholder={ip.ph}
            name={ip.name}
            value={ip.value}
            onChange={(e) => handleSearchParams(e)}
            className="rounded-sm max-w-[100%]  max-h-[30px] focus-visible:ring-0 mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default SellsFilter;
