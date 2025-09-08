
import React from 'react';
import { CSVLink } from 'react-csv'; 
import { Button } from './ui/button';

interface TableProps { 
  data: any,
  tableType: 'purchase' | 'sells' | 'inventory'
}

const ExportTable: React.FC<TableProps> = ({ data, tableType }) => {
  
  const today = new Date();
  const date = new Intl.DateTimeFormat('en-GB').format(today); 

  let transformedData;
  let header;
  if(tableType === 'sells') {
    header = [
      { label: 'Memo', key: 'Memo' },
      { label: 'Particulars', key: 'Particulars' },
      { label: 'Batch', key: 'Batch' },
      { label: 'Expiry', key: 'Expiry' },
      { label: 'quantity', key: 'quantity' },
      { label: 'Rate', key: 'Rate' },
      { label: 'GST', key: 'GST' },
      { label: 'MRP', key: 'MRP' },
      { label: 'Discount', key: 'Discount' },
      { label: 'Total', key: 'Total' }, 
      { label: 'Patient', key: 'Patient' },
      { label: 'Date', key: 'Date' },

    ];
    transformedData = data.map((item: any) => ({
      Memo: item.memoPriceToMaster?.memoNo,
      Particulars: item.medicine_name,
      Batch: item.batchNo,
      Expiry: item?.expiry,
      quantity: item.quantity,
      Rate: item.rate,
      GST: item.gst,
      MRP: item.mrp,
      Discount: item.discount,
      Total: item.total_price,
      Buyer: item.memoPriceToMaster?.buyer_name,
      Patient: item.memoPriceToMaster?.patient_name,
      Date: item.memoPriceToMaster?.memoDate
    }));
  } else if(tableType === 'purchase')  {
    header = [
      { label: 'Particulars', key: 'Particulars' },
      { label: 'Batch', key: 'Batch' },
      { label: 'quantity', key: 'quantity' },
      { label: 'Expiry', key: 'Expiry' },
      { label: 'Rate', key: 'Rate' },
      { label: 'GST', key: 'GST' },
      { label: 'MRP', key: 'MRP' },
      { label: 'Discount', key: 'Discount' },
      { label: 'Total', key: 'Total' },
      { label: 'Invoice Id', key: 'InvoiceId' },
      { label: 'Invoice Date', key: 'InvoiceDate' },
      { label: 'Vendor', key: 'Vendor' },
    ];
    transformedData = data.map((item: any) => ({ 
      Particulars: item.medicine_name,
      Batch: item.batchNo,
      quantity: item.quantity,
      MRP: item.mrp,
      Rate: item.rate,
      Discount: item.discount,
      GST: item.gst,
      Total: item.total_med_amount,
      Expiry: item.expiry,
      InvoiceId: item.invoicePriceToMaster?.invoice_No,
      InvoiceDate: item.invoicePriceToMaster?.invoice_date,
      Vendor: item.invoicePriceToMaster?.invoiceToVendor?.vendor_name,
    }));
  } else if(tableType === 'inventory')  {
    header = [
      { label: 'Particulars', key: 'Particulars' },
      { label: 'Batch', key: 'Batch' },
      { label: 'MFG', key: 'MFG' },
      { label: 'Pack', key: 'Pack' },
      { label: 'Location', key: 'Location' },
      { label: 'HSN', key: 'HSN' },
      { label: 'Quantity', key: 'Quantity' },
      { label: 'MRP', key: 'MRP' },
      { label: 'Rate', key: 'Rate' },
      { label: 'Total', key: 'Total' },
      { label: 'Expiry', key: 'Expiry' },
    ];
    transformedData = data.map((item: any) => ({ 
      Particulars: item.batchToMedicine?.medicine_name,
      Batch: item.batchNo,
      MFG: item.batchToMedicine?.mfgBy,
      Pack: item.batchToMedicine?.pack,
      Location: item.location,
      HSN: item.batchToMedicine?.hsnCode,
      Quantity: item.quantity,
      MRP: item.mrp,
      Rate: item.rate,
      Total: item.total_amount,
      Expiry: item.expiry,
    }));
  }


  return ( 
      <CSVLink
        headers={header}
        data={transformedData}
        filename={`${date}.csv`}
        style={{ textDecoration: 'none' }}
      >
        <Button className="hover:text-green-500 mt-3 mr-5">
          Export Table
        </Button>
      </CSVLink> 
  );
};

export default ExportTable;
