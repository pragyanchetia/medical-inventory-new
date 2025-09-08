import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import React from "react"; 
const Loader = () => {
    return ( 
        <div className="flex items-center justify-center mt-56"> 
            <LoaderCircle width={40} height={40} className="animate-spin"/>  
        </div> 
    );
  };
  
  export default Loader;