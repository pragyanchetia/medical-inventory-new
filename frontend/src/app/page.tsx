"use client";

import React, { useEffect, useState } from "react";

import Navbar from "@/components/navbar";

import Loader from "@/components/loader";
import CreateInvoice from "../components/blocks/create-invoice";
import CreateMemo from "@/components/blocks/add-new-memo";
import AddNewMedicines from "@/components/blocks/add-new-medicines";
import AddVendor from "@/components/blocks/add-vendor";
import DataTables from "../components/blocks/tables";
import { componentType } from "../../../backend/src/shared/types";
import Login from "@/components/login";
import BackupSettings from "@/components/blocks/backup-settings";

export default function Home() {
  const [formComponent, setFormComponent] = useState<string>(
    componentType.invoiceForm
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isToken, setIsToken] = useState(false);

  const handleComponentChange = (newComponent: string) => {
    sessionStorage.setItem("navComponentState", newComponent);
    setFormComponent(newComponent);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const savedComponent = sessionStorage.getItem("navComponentState");

      setFormComponent(savedComponent || componentType.invoiceForm);
      if (token) {
        setIsToken(true);
      } else {
        setIsToken(false);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);
  if (isLoading) {
    return <Loader />;
  }

  if (!isToken) {
    return <Login />;
  }
  return (
    <>
      <Navbar
        formComponent={formComponent}
        handleComponentChange={handleComponentChange}
      />

      {formComponent === componentType.invoiceForm ? (
        <CreateInvoice />
      ) : formComponent === componentType.memoForm ? (
        <CreateMemo />
      ) : formComponent === componentType.medicineForm ? (
        <AddNewMedicines />
      ) : formComponent === componentType.vendorForm ? (
        <AddVendor />
      ) : formComponent === componentType.tables ? (
        <DataTables />
      ) : formComponent === componentType.backup ? (
        <BackupSettings />
      ) : (
        <CreateInvoice />
      )}
    </>
  );
}
