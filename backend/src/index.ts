const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
import fs from 'fs';
import path from 'path';

//env setup:
dotenv.config();

//custom routes:
import tableRoute from './routes/tableRoute';
import memoRoute from './routes/memoRoute';
import userRoute from './routes/userRoute';
import invoiceRoute from './routes/invoiceRoute';
import vendorRoute from './routes/vendorRoute'; 
import backupRoute from './routes/backupRoute';
import { NextFunction, Request, Response } from 'express';

const app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 4000;

const allowedOrigin = `http://localhost:3000`;

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.options('*', cors()); 


const checkDatabase = (req:Request, res: Response, next: NextFunction) => {
    const databasePath = path.join(__dirname, "..", 'prisma', 'dev.db'); 

    if (!fs.existsSync(databasePath)) {
      console.error(`Database file not found at ${databasePath}!`); 
      return res.status(404).send({message: "Database is missing or inaccessible! Upload Backup!"})
    } else {
      console.log("Database Found!"); 
      next();
    }
} 

app.use("/api/userRoute", checkDatabase, userRoute);
app.use("/api/invoiceRoute", checkDatabase, invoiceRoute);  
app.use("/api/vendorRoute", checkDatabase, vendorRoute);
app.use("/api/tableRoute", checkDatabase, tableRoute);
app.use("/api/memoRoute", checkDatabase, memoRoute); 
app.use('/api/backupRoute', backupRoute);
 
app.listen(PORT, () => { 
  console.log(`Backend server is running on http://localhost:${PORT}`);
});