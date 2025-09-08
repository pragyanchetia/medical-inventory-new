import express, { Request, Response } from "express";
import { prisma } from '../db';
import { VendorMasterType } from "../shared/types";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

//create vendor:
router.post("/add-vendor", authenticateToken, async (req: Request, res: Response) => {
  try {
    const vendor_body: VendorMasterType = req.body;
    const existedVendor = await prisma.vendor_master.findMany({ 
      where: {
        OR: [
          { vendorMasterId: vendor_body?.vendorMasterId },
          { vendor_name: vendor_body?.vendor_name },
        ],
      },
    });
    
    if (existedVendor.length === 0) {
      await prisma.vendor_master.create({
        data: {
          vendorMasterId: vendor_body?.vendorMasterId,
          vendor_name: vendor_body?.vendor_name,
          address: vendor_body?.address,
          phone_no: vendor_body?.phone_no,
          email: vendor_body?.email,
          dl_no: vendor_body?.dl_no,
          gstin: vendor_body?.gstin,
        },
      });

      res.status(201).send({ message: "Vendor Added Successfully!" });
    } else {
      res.status(406).send({ message: "Vendor Already Existed!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server Error while adding vendor" });
  }
});

//get vendor:
router.get("/get-vendor", authenticateToken, async (req: Request, res: Response) => {
  try {
    const getVendors = await prisma.vendor_master.findMany({
      include: {
        vendor_invoices: true,
      },
    });

    res.json(getVendors);
  } catch (error) {
    console.log("error sending vendors in backend.", error);
    res.status(500).json({ message: "Error from backend!" });
  }
});

export default router;
