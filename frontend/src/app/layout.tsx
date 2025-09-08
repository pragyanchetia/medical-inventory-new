import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";   

import 'react-toastify/dist/ReactToastify.css';
export const metadata: Metadata = {
  title: "KUSUM MEDICAL STORE RMS",
  description: "This is Pharmacy Inventory Management System App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('bg-slate-300 text-[#193b4f]')}>
        <main>{children}</main>
      </body>
    </html>
  );
}
