import express, { Request, Response } from "express";
import { prisma } from '../db';
import { InvoiceEntry } from "../shared/types";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

//get invoiceNo:
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice_master.aggregate({
      _count: true,
    });

    const invoiceCount = invoice._count;

    res.status(200).send({ message: "Counted!", invoiceCount });
  } catch (error) {
    console.log("Something Wrong on The Server!", error);
    res.status(500).send({ message: "Server-Side Fetch Error!" });
  }
});

//get all vendor invoices:
router.get("/get-purchases", authenticateToken, async (req: Request, res: Response) => {
  try {
    const purchases = await prisma.invoice_prices.findMany({
      include: {
        invoicePriceToMaster: {
          select: { 
            invoice_date: true,
            invoice_No: true,
            gross_amount: true,
            total_discount: true,
            total_gst: true,
            grand_total: true,
            added_stock: true,
            invoiceToVendor: {
              select: {
                vendor_name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(purchases);
  } catch (error) {
    console.log("Something Wrong on The Server!", error);
    res.status(500).send({ message: "Server-Side Fetch Error!" });
  }
});

//create an invoice:
router.post("/create-invoice", authenticateToken, async (req: Request, res: Response) => {
  try {
    const invoice_body: InvoiceEntry = req.body;
 
    const isExisted = await prisma.invoice_master.findUnique({
      where: {
        invoice_No: invoice_body.invoice_No,
      },
    });

    if (isExisted === null) {
      let added_stock = 0;
      //maps over each item -> takes qty of it -> add it to added_stock
      invoice_body.invoice_details.map((iv) => {
        added_stock += iv.quantity;
      });
 
      await prisma.invoice_master.create({
        data: {
          invoice_No: invoice_body.invoice_No, 
          invoice_date: invoice_body.invoice_date,
          vendorMasterId: invoice_body.vendor,
          invoice_prices: {
            create: invoice_body.invoice_details.map((iv) => ({
              medicine_name: iv.medicine_name,
              medicine_type: iv.medicine_type,
              batchNo: iv.batchNo,
              quantity: iv.quantity,
              mrp: iv.mrp,
              rate: iv.rate,
              gst: iv.gst,
              discount: iv.discount,
              expiry: iv.expiry,
              total_med_amount: iv.total_med_amount,
            })),
          },
          grand_total: invoice_body.grand_total,
          total_discount: invoice_body.total_discount,
          total_gst: invoice_body.total_gst,
          gross_amount: invoice_body.gross_amount,
          added_stock: added_stock,
        },
      });

      //update added stock logic:
      invoice_body.invoice_details.map(async (iv) => {
        await prisma.batches.update({
          where: {
            batchNo: iv.batchNo,
          },
          data: {
            quantity: {
              increment: iv.quantity,
            },
            batchToMedicine: {
              update: {
                where: {
                  medicine_name: iv.medicine_name,
                },
                data: {
                  total_stock: {
                    increment: iv.quantity,
                  },
                },
              },
            },
          },
        });
      });

      res.status(201).send({ message: "New Invoice Created Successfully!" });
    } else {
      res
        .status(406)
        .send({ message: "Duplicate Invoice No. Invoice Already Exists!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Server Error While Creating Invoice!", error });
  }
});

export default router;
