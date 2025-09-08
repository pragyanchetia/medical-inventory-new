import React, { useEffect, useState } from 'react'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { selectedVendorArgsProps } from './vendor-selector';
import { VendorMasterType } from '../../../backend/src/shared/types';
import { Button } from './ui/button';
import { server } from '@/utils/server';

interface selectedVendorProp {
    getThatVendor: ({
        vendorId,
        vendor_name,
        address,
        phone_no,
        dl_no,
        gstin,
      }: selectedVendorArgsProps) => void,
}
const VendorList = ({getThatVendor}: selectedVendorProp) => {

   const [vendors, setVendors] = useState<VendorMasterType[]>([]);
    //get all the vendor Details
    useEffect(() => {
      const getVendors = async () => {
        try {
          const response = await server.get(
            "/vendorRoute/get-vendor"
          );
          setVendors(response.data);
        } catch (error) {
          console.log("Error Fetching Vendors...", error);
        }
      };
      getVendors();
    }, []);
 
    const options = vendors.map(obj => obj.vendor_name);
 
    const handleChange = (value: string | null) => {
        const vendor = vendors.find(vendor=> vendor.vendor_name === value)!

        getThatVendor({
            vendorId: vendor?.vendorMasterId,
            vendor_name: vendor?.vendor_name,
            address: vendor?.address,
            phone_no: vendor?.phone_no,
            dl_no: vendor?.dl_no,
            gstin: vendor?.gstin,
          })
    }
    return (
      <div className='flex flex-row gap-3 items-center'>
        <Autocomplete
          onChange={(event: any, newValue: string | null) => {
            handleChange(newValue);
          }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300 }} 
          renderInput={(params) => <TextField {...params} label="Select wholesaler"/>}
        />
      </div>
    );
}

export default VendorList
