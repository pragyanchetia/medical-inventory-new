import express, { Request, Response } from "express";
import { prisma } from '../db';
import { MedicineInput } from "../shared/types";
import { authenticateToken, isAdmin } from "../middleware/auth";
const router = express.Router();


//get all medicines inventory:
router.get("/get-all-med", authenticateToken, async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.batches.findMany({
      include: {
        batchToMedicine: {
          select: {
            medicine_name: true,
            pack: true,
            hsnCode: true,
            mfgBy: true,
          }
        }, 
      }
    })
    res.json(medicines);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Server Error On Fetching Medicines!" });
  }
});

//add/create new medicine:
router.post("/add-new-med", authenticateToken, async (req: Request, res: Response) => {
  try {
    const newMedicine: MedicineInput = req.body;

    const totalAmountPerBatch = newMedicine.rate*newMedicine.quantity;
    const netPrice = newMedicine.rate + (newMedicine.rate*(newMedicine.gst/100)) - (newMedicine.rate*(newMedicine.discount/100));

    const existedMedicine = await prisma.inventory.findUnique({
      where: {
        medicine_name: newMedicine.medicine_name,
      },
    });

    if (existedMedicine !== null) { //yes medicine
      const existedBatch = await prisma.batches.findUnique({
        where: {
          batchNo: newMedicine.batchNo,
        },
      });

      if (existedBatch === null) {
        const newStock = newMedicine.quantity + existedMedicine.total_stock;
      
        await prisma.inventory.update({
          where: {
            medicine_name: newMedicine.medicine_name,
          },
          data: {
            total_stock: newStock,
            medicine_batches: {
              create: {
                batchNo: newMedicine.batchNo,
                quantity: newMedicine.quantity,
                location: newMedicine.location,
                mrp: newMedicine.mrp,
                rate: newMedicine.rate,
                gst: newMedicine.gst,
                discount: newMedicine.discount,
                total_amount: totalAmountPerBatch, 
                net_pricing: netPrice,
                expiry: newMedicine.expiry,
              },
            },
          },
        });

        res
          .status(201)
          .send({ message: "New Medicine Batch Added Successfully!" });
      } else if (existedBatch !== null) {
        res.status(406).send({ message: "Batch Is Already Existed!" });
      }
       
    } else {
      const existedBatch = await prisma.batches.findUnique({
        where: {
          batchNo: newMedicine.batchNo,
        },
      });
      if(existedBatch !== null) {
        res
        .status(201)
        .send({ message: "Batch No already exists!" });
      } else {
        await prisma.inventory.create({
          include: {
            medicine_batches: true,
          },
          data: {
            medicine_name: newMedicine.medicine_name,
            pack: newMedicine.pack,
            hsnCode: newMedicine.hsnCode,
            mfgBy: newMedicine.mfgBy,
            mkdBy: newMedicine.mkdBy,
            total_stock: newMedicine.quantity, 
            medicine_batches: {
              create: {
                batchNo: newMedicine.batchNo,
                total_amount: totalAmountPerBatch,
                net_pricing: netPrice,
                discount: newMedicine.discount,
                mrp: newMedicine.mrp,
                rate: newMedicine.rate,
                gst: newMedicine.gst,
                quantity: newMedicine.quantity,
                location: newMedicine.location,
                expiry: newMedicine.expiry,
              },
            },
          },
        });
  
        res
          .status(201)
          .send({ message: "New Medicine Batch Added Successfully!" });
      }    
    }
  } catch (error) {
    res.status(500).send({ message: "Server Error While Adding Medicine!" });
  }
});

//get stocked medicines:
router.get('/get-stocked-med', authenticateToken, async (req: Request, res: Response) => {
  try {
      const medicines = await prisma.batches.findMany({
        where: {
          NOT: {
            quantity: {
              lt: 3
            }
          }
        },
        include: {
          batchToMedicine: true
        }
      });

      res.json(medicines);
    } catch (error) {
      console.log("Error fetching stocked medicine:", error);
      res.status(500).send({ message: "Something went wrong. Server Error" });
    } 
});

type updateStockType = {
  stockInt: number;
  batchNo: string;
  rate: number;
};

//add medicine stock:
router.post("/add-med-stock", isAdmin, async (req: Request, res: Response) => {
  try {
    const data: updateStockType = req.body;

    const stock = await prisma.batches.findUnique({
      where: { 
        batchNo: data.batchNo
      },
    });

    if(stock) {
      await prisma.batches.update({
        where: {
          batchNo: data.batchNo
        },
        data: {
          quantity: {
            increment: data.stockInt
          },
          total_amount: {
            increment: data.stockInt * data.rate
          },
          batchToMedicine: {
            update: {
              total_stock: {
                increment: data.stockInt
              },
            }
          }
        }
      })
    }

    res.status(201).send({ message: "Stock Updated!"});
  } catch (error) {
    console.log("Error adding medicine.", error);
    res.status(500).send({ message: "Something went wrong. Server Error" });
  }
});

//delete batch:
router.delete("/delete-batch", isAdmin, async (req: Request, res: Response) => {
  try {
    const { batchNo }  = req.body;

    await prisma.batches.delete({
      where: {
        batchNo: batchNo
      }, 
    });

    res.status(201).send({message: "Batch is deleted!"});
  } catch (error) {
    console.log("Error deleting medicine:", error);
    res.status(500).send({ message: "Something went wrong. Server Error" });
  } 
});


export default router;
