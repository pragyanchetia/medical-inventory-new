"use client";

import React, { useEffect, useState } from "react";
import { server } from "@/utils/server";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Loader from "@/components/loader";
import useLoading from "@/hooks/loader.hook";
import { HardDriveUpload } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadBackup = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("backup", file);

      try {
        const response = await server.post(
          "/backupRoute/upload-backup",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alertWindow(response.data.message);
      } catch (error) {
        alertWindow("Error Uploading The Backup!");
      }
    } else {
      alertWindow("Please select a file first!");
    }
  };

  const isLoading = useLoading();

  const [isToken, setToken] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    // Checking if token exists in localStorage and setting isToken accordingly
    const token = localStorage.getItem("token");
    if (token) {
      setToken(true);
      window.location.reload();
    }
  }, []);

  if (isLoading) return <Loader />;
  if (isToken) return null; // Prevents rendering login form when already authenticated

  const alertWindow = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2300);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form from reloading the page
    setIsSubmitting(true); 
    try { 
      const res = await server.post(`/userRoute/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      alertWindow(res.data.message || "Logged in successfully!");
      setToken(true);
      window.location.reload(); // Redirect to  after successful login
    } catch (error: any) {
      alertWindow(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col h-[100vh]">
      <div className="text-xl mb-3 text-red-500 font-semibold">
        <h3>{alertMessage}</h3>
      </div>
      <div className="bg-slate-400 rounded-md min-w-48">
        <h2 className="text-2xl font-semibold p-3 text-center border-b-2 border-slate-300">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center space-y-3 p-4"
        >
          <div className="p-2 grid gap-2">
            <label>User Name:</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="p-2 grid gap-2">
            <label>Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="hover:text-green-500">
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div> 
      <div className="mt-4 flex flex-col gap-2 p-3 items-center justify-center bg-slate-400 rounded-md">
        <h1 className="mb-3 border-b-2 border-slate-300 text-[1.3rem] font-semibold w-full text-center p-3">
          Get Backup
        </h1>
        <div className="flex flex-row gap-2">
          <Input className="w-64" type="file" onChange={handleFileChange} />
          <Button
            className="w-40 text-[#efefef] hover:text-green-400 text-center"
            onClick={handleUploadBackup}
          >
            <HardDriveUpload width={18} className="mr-[0.40rem]" />
            <span>Backup</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
