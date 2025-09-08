import React, { useState } from "react";
import { Button } from "../ui/button";
import { HardDriveDownload, HardDriveUpload } from "lucide-react";
import { server } from "@/utils/server";
import { Input } from "../ui/input";

const BackupSettings = () => {

  
  const [alertMessage, setAlertMessage] = useState<string>("");

  const alertWindow = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2400);
  };
  const handleDownloadBackup = async () => {
    try { 
      const response = await server({
        url: '/backupRoute/download-backup-data',
        method: 'GET',
        responseType: 'blob', // This ensures the response is treated as a file (blob)
      });
  
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup-data.db'; // You can specify the file name here
      a.click();
      window.URL.revokeObjectURL(url); // Clean up the object URL
  
      alertWindow("Downloaded successfully!");
    } catch (error: any) {
      alertWindow("Error while backing up!");
      console.error(error);
    }
  };
  

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadBackup = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('backup', file);

      try {
        const response = await server.post('/backupRoute/upload-backup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alertWindow(response.data.message);

      } catch (error) {
        alertWindow("Error Uploading The Backup!");
      }
    } else {
      alertWindow("Please select a file first!");
    }
  };
  return (
    <div className="flex flex-col justify-start items-start gap-4 m-20 rounded-lg font-semibold">
      <div className="text-xl mb-3 text-red-500 font-semibold">
        <h3>{alertMessage}</h3>
      </div>
      <div className="w-56 gap-2">
        <h1 className="mb-3 text-[20px]">Download Backup</h1>
        <Button
          className="w-40 text-[#efefef] hover:text-green-400 text-center"
          onClick={handleDownloadBackup}
        >
          <HardDriveDownload width={18} className="mr-1" /> 
          <span>Download</span>
        </Button>
      </div>
      <div className="w-56 gap-2">
       <h1 className="mb-3 text-[20px]">Upload Backup</h1>
       <div className="flex flex-row gap-2"> 
       <Input className="w-64" type="file" onChange={handleFileChange} />
        <Button
          className="w-40 text-[#efefef] hover:text-green-400 text-center"
          onClick={handleUploadBackup}
        >
          <HardDriveUpload width={18} className="mr-1"/> 
          <span>Backup</span>
        </Button>
       </div>
      </div>
    </div>
  );
};

export default BackupSettings;
