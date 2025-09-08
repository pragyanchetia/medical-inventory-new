import React, { useState, ChangeEvent } from "react";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Info, LogOut, Server, User } from "lucide-react";
import { componentType } from "../../../backend/src/shared/types";
import { Button } from "./ui/button";
import { server } from "@/utils/server";

interface NavbarProps {
  formComponent: string;
  handleComponentChange: (formComponent: componentType) => void;
}
const Navbar = ({ formComponent, handleComponentChange }: NavbarProps) => {
  const components = [
    { header: "Invoice", type: componentType.invoiceForm },
    { header: "Memo", type: componentType.memoForm },
    { header: "Add Vendor", type: componentType.vendorForm },
    { header: "Add Medicine", type: componentType.medicineForm },
    { header: "Tables", type: componentType.tables },
    { header: "Backup", type: componentType.backup },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("navTableState");
    sessionStorage.removeItem("navComponentState");
    window.location.reload();
  };

  return (
    <div className="flex flex-row justify-between items-center h-[10vh] min-w-[99.21875vw]  bg-[#405D72] text-[1rem] py-5 pb-4 px-4">
      <p className="uppercase text-[1.12rem] text-[#efefef]">
        Kusum Medical Store
      </p>
      <div>
        <div className="flex flex-row items-center justify-evenly space-x-4">
          {components.map((com, key) => 
              <Button
                key={key}
                className={cn(
                  "max-w-fit",
                  formComponent === com.type
                    ? "text-green-500"
                    : "text-[#efefef] hover:text-green-400"
                )}
                onClick={() => handleComponentChange(com.type)}
              >
                {com.header}
              </Button> 
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="max-w-[100%] outline-0">
              <User
                width={30}
                className="hover:text-[#efefef] rounded-full p-1 hover:bg-green-400 bg-[#efefef]"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 mr-5 z-0 bg-teal-200 border-teal-100 text-[#193b4f]">
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut width={15} className="mr-1" /> Sign Out
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info width={15} className="mr-1" />
                About
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
