"use client";

import React, { useMemo, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MemoMasterType } from "../../../../backend/src/shared/types";

export type searchTypes = {
  memoNo: string;
  patient: string;
  doctor: string;
  date: string;
};

interface searchProps {
  memo: MemoMasterType[];
  handleFilterData: (filteredData: MemoMasterType[]) => void;
}
const MemoFilter = ({ memo, handleFilterData }: searchProps) => {
  const [tempFilter, setTempFilter] = useState<MemoMasterType[]>([]);

  const handleData = useMemo(
    () => handleFilterData(tempFilter),
    [tempFilter, handleFilterData]
  );

  const [searchParams, setSearchParams] = useState<searchTypes>({
    memoNo: "",
    patient: "",
    doctor: "",
    date: "",
  });
  const handleSearchParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const updatedParams = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      e.target.name === "memoNo" && updatedParams?.memoNo
        ? setTempFilter(
            memo.filter((lg) =>
              lg.memoNo
                ?.toLowerCase()
                .includes(updatedParams?.memoNo.toLowerCase())
            )
          )
        : e.target.name === "patient" && updatedParams?.patient
        ? setTempFilter(
            memo.filter((lg) =>
              lg.patient_name
                ?.toLowerCase()
                .includes(updatedParams?.patient.toLowerCase())
            )
          )
        : e.target.name === "medicineName" && updatedParams?.doctor
        ? setTempFilter(
            memo.filter((lg) =>
              lg.doctor_name
                ?.toLowerCase()
                .includes(updatedParams?.doctor.toLowerCase())
            )
          )
        : e.target.name === "date" && updatedParams?.date
        ? setTempFilter(
            memo.filter((lg) =>
              lg.memoDate
                ?.toLowerCase()
                .includes(updatedParams?.date.toLowerCase())
            )
          )
        : setTempFilter(memo);

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
      name: "patient",
      type: "text",
      ph: "Enter Patient Name",
      label: "Patient Name",
      value: searchParams.patient,
    },
    {
      name: "doctor",
      type: "text",
      ph: "Enter Doctor Name",
      label: "Doctor Name",
      value: searchParams.doctor,
    },
    {
      name: "date",
      type: "text",
      ph: "Enter Date",
      label: "Date",
      value: searchParams.date,
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
            className="rounded-sm max-w-[100%] max-h-[30px] focus-visible:ring-0 mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default MemoFilter;

