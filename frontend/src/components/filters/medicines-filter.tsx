"use client";

import React, { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MedicinesType } from "../../../../backend/src/shared/types";

export type searchTypes = {
  medicineName: string;
  batchNo: string;
  expiry: string;
  mfgBy: string;
};

interface searchProps {
  meds: MedicinesType[];
  handleFilterData: (filteredData: MedicinesType[]) => void;
}
const MedicineFilter = ({ meds, handleFilterData }: searchProps) => {
  const [tempFilter, setTempFilter] = useState<MedicinesType[]>([]);

  const handleData = useMemo(
    () => handleFilterData(tempFilter),
    [tempFilter, handleFilterData]
  );

  const [searchParams, setSearchParams] = useState<searchTypes>({
    medicineName: "",
    batchNo: "",
    expiry: "",
    mfgBy: "",
  });
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const updatedParams = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      e.target.name === "batchNo" && updatedParams?.batchNo
        ? setTempFilter(
            meds.filter((med) =>
              med.batchNo
                ?.toLowerCase()
                .includes(updatedParams?.batchNo.toLowerCase())
            )
          )
        : e.target.name === "medicineName" && updatedParams?.medicineName
        ? setTempFilter(
            meds.filter((med) =>
              med.batchToMedicine?.medicine_name
                ?.toLowerCase()
                .includes(updatedParams?.medicineName.toLowerCase())
            )
          )
        : e.target.name === "expiry" && updatedParams?.expiry
        ? setTempFilter(
            meds.filter((med) => med?.expiry?.includes(updatedParams?.expiry))
          )
        : e.target.name === "mfgBy" && updatedParams?.mfgBy
        ? setTempFilter(
            meds.filter((med) =>
              med.batchToMedicine?.mfgBy
                ?.toLowerCase()
                .includes(updatedParams?.mfgBy.toLowerCase())
            )
          )
        : setTempFilter(meds);

      return updatedParams;
    });
  };

  handleData;

  const filtersInput = [
    {
      name: "medicineName",
      label: "Medicine Name",
      type: "text",
      ph: "Medicine",
      value: searchParams.medicineName,
    },
    {
      name: "batchNo",
      label: "Batch No",
      type: "text",
      ph: "Batch No",
      value: searchParams.batchNo,
    },
    {
      name: "expiry",
      label: "Expiry Date",
      type: "date",
      ph: "Expiry Date",
      value: searchParams.expiry,
    },
    {
      name: "mfgBy",
      label: "MFG by",
      type: "text",
      ph: "MFG By",
      value: searchParams.mfgBy,
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

export default MedicineFilter;
