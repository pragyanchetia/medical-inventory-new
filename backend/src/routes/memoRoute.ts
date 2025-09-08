import express, { Request, Response } from "express";
import { prisma } from "../db";
import { memoEditInput, MemoMasterType } from "../shared/types";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = express.Router();

export interface AuthRequest extends Request {
  user?: any;
}

//get memoNo:
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const memo = await prisma.memo_master.aggregate({
      _count: true,
    });

    const memoCount = memo._count;

    res.status(200).send({ message: "Counted!", memoCount });
  } catch (error) {
    console.log("Something Wrong on The Server!", error);
    res.status(500).send({ message: "Server-Side Fetch Error!" });
  }
});

//get all memo sells:
router.get(
  "/get-sells",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const sells = await prisma.memo_prices.findMany({
        include: {
          memoPriceToMaster: true,
        },
      });
      res.status(200).send(sells);
    } catch (error) {
      console.log("Something Wrong on The Server!", error);
      res.status(500).send({ message: "Server-Side Fetch Error!" });
    }
  }
);

//get all memos:
router.get(
  "/get-memos",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const memos = await prisma.memo_master.findMany();

      res.status(200).send(memos);
    } catch (error) {
      console.log("Something Wrong on The Server!", error);
      res.status(500).send({ message: "Server-Side Fetch Error!" });
    }
  }
);

//add new memo
router.post(
  "/add-new-memo",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const memo_body: MemoMasterType = req.body;

      const ExistedMemo = await prisma.memo_master.findUnique({
        where: {
          memoNo: memo_body.memoNo,
        },
      });

      if (ExistedMemo === null) {
        const memoDate = new Date().toISOString().substring(0, 10);

        await prisma.memo_master.create({
          data: {
            memoNo: memo_body.memoNo,
            patient_name: memo_body.patient_name,
            doctor_name: memo_body.doctor_name,
            contact: memo_body.contact,
            transaction_id: memo_body?.transaction_id,
            diagnostics: memo_body?.diagnostics,
            address: memo_body?.address,
            gross_amount: memo_body.gross_amount,
            total_discount: memo_body.total_discount,
            total_gst: memo_body.total_gst,
            grand_total: memo_body.grand_total,
            total_quantity: memo_body.total_quantity,
            memoDate: memoDate,
            memo_prices: {
              create: memo_body.memo_prices.map((pr) => ({
                medicine_name: pr.medicine_name,
                batchNo: pr.batchNo,
                quantity: pr.quantity,
                expiry: pr.expiry,
                pack: pr.pack,
                mfgBy: pr.mfgBy,
                mrp: pr.mrp,
                rate: pr.rate,
                gst: pr.gst,
                discount: pr.discount,
                total_price: pr.total_price,
              })),
            },
          },
        });

        //update stock:
        memo_body.memo_prices.map(async (mp) => {
          const total_amount_decrement = mp.quantity * mp.rate;
          await prisma.batches.updateMany({
            where: {
              AND: [
                { batchNo: mp.batchNo },
                {
                  batchToMedicine: {
                    medicine_name: mp.medicine_name,
                  },
                },
                {
                  quantity: {
                    gte: 0,
                  },
                },
              ],
            },
            data: {
              quantity: {
                decrement: mp.quantity,
              },
              total_amount: {
                decrement: total_amount_decrement,
              },
            },
          });
          await prisma.batches.update({
            where: { batchNo: mp.batchNo },
            data: {
              batchToMedicine: {
                update: {
                  total_stock: {
                    decrement: mp.quantity,
                  },
                },
              },
            },
          });
        });

        res.status(201).send({ message: "Memo Created Successfully!" });
      } else {
        res.status(406).send({ message: "Memo Already Existed!" });
      }
    } catch (error) {
      console.log("Error creating memo:", error);
      res.status(500).send({ message: "Something went wrong. Server Error" });
    }
  }
);

//get the memo that needs to be edited:
router.get(
  "/get-edited-memo",
  isAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { memoId } = req.query;

      const memo = await prisma.memo_master.findUnique({
        where: {
          memoNo: memoId as string,
        },
        include: {
          memo_prices: true,
        },
      });

      const medPrices = memo?.memo_prices ?? []; // Default to an empty array if undefined or null

      const medExists = await Promise.all(
        medPrices.map(async (old) => {
          const isMedNotDeleted = await prisma.batches.findFirst({
            where: {
              batchNo: old.batchNo,
            },
          });
          return !!isMedNotDeleted; // Return true if the batch exists, false otherwise
        })
      );

      if (medExists.some((exists) => !exists)) {
        res
          .status(201)
          .send({
            message:
              "Memo Cannot be updated because the medicine batch expires!",
          });
      } else {
        const currentMemo = await prisma.memo_master.findUnique({
          where: {
            memoNo: memoId as string,
          },
          select: {
            memoNo: true,
            memoDate: true,
            patient_name: true,
            doctor_name: true,
            address: true,
            contact: true,
            diagnostics: true,
            transaction_id: true,
            total_discount: true,
            total_gst: true,
            total_quantity: true,
            gross_amount: true,
            grand_total: true,
            memo_prices: {
              select: {
                medicine_name: true,
                batchNo: true,
                quantity: true,
                mrp: true,
                rate: true,
                discount: true,
                gst: true,
                total_price: true,
                expiry: true,
                pack: true,
                hsnCode: true,
                mfgBy: true,
              },
            },
          },
        });

        res.status(200).send(currentMemo);
      }
    } catch (error) {
      console.log("Something Wrong on The Server!", error);
      res.status(500).send({ message: "Server-Side Fetch Error!" });
    }
  }
);

//delete memo:
router.delete("/delete-memo", async (req: AuthRequest, res: Response) => {
  try {
    const { memoNo } = req.body;

    await prisma.memo_master.delete({
      where: {
        memoNo: memoNo as string,
      },
    });

    res.status(201).send({ message: "Memo is deleted!" });
  } catch (error) {
    console.log("Error deleting memo:", error);
    res.status(500).send({ message: "Something went wrong. Server Error" });
  }
});

//update memo:
router.put("/set-memo", isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const memo_body: memoEditInput = req.body;

    const today = new Date();
    const date = new Intl.DateTimeFormat("en-GB").format(today);

    if (
      parseInt(
        memo_body.memoDate
          ?.split("-")
          .reverse()
          .join("-")
          .substring(0, 2) as string
      ) <
      parseInt(date.substring(0, 2)) + 10
    ) {
      res.status(401).send({ message: "Cannot be edited!" });
    }

    const ExistedMemo = await prisma.memo_master.findUnique({
      where: {
        memoNo: memo_body.memoNo,
      },
    });

    if (ExistedMemo !== null) {
      await prisma.memo_master.update({
        where: {
          memoNo: memo_body.memoNo,
        },
        data: {
          patient_name: memo_body.patient_name,
          doctor_name: memo_body.doctor_name,
          contact: memo_body.contact,
          transaction_id: memo_body?.transaction_id,
          diagnostics: memo_body?.diagnostics,
          address: memo_body?.address,
          gross_amount: memo_body.gross_amount,
          total_discount: memo_body.total_discount,
          total_gst: memo_body.total_gst,
          grand_total: memo_body.grand_total,
          total_quantity: memo_body.total_quantity,
        },
      });

      const medExists = memo_body.memo_prices?.map(async (old) => {
        const isMedNotDeleted = await prisma.batches.findFirst({
          where: {
            batchNo: old.batchNo,
          },
        });
        return !!isMedNotDeleted; // Return true if the batch exists, false otherwise
      });

      if (!medExists) {
        res
          .status(201)
          .send({
            message:
              "Memo Cannot be updated because the medicine batch expires!",
          });
      }

      memo_body.memo_prices?.map(async (old) => {
        let updatedQuantity: number | null = 0;

        const newValue = await prisma.memo_prices.findFirst({
          where: {
            AND: [
              {
                memoPriceToMaster: {
                  memoNo: old.memoNo,
                },
              },
              { batchNo: old.batchNo },
            ],
          },
        });

        if (newValue?.quantity === old.quantity) {
          updatedQuantity = null;
        } else if (newValue?.quantity ?? 0 > old.quantity) {
          //new qty > new qty
          updatedQuantity = (newValue?.quantity ?? 0) - old.quantity; //+ve
        } else if (newValue?.quantity ?? 0 < old.quantity) {
          //old qty < new qty
          updatedQuantity = (newValue?.quantity ?? 0) - old.quantity; //-ve
        }

        await prisma.memo_prices.updateMany({
          where: {
            AND: [
              {
                memoPriceToMaster: {
                  memoNo: old.memoNo,
                },
              },
              { batchNo: old.batchNo },
            ],
          },
          data: {
            quantity: old.quantity,
            total_price: old.total_price,
          },
        });

        const quantity =
          updatedQuantity !== undefined && updatedQuantity !== null
            ? updatedQuantity
            : 0;
        const mrp = old.mrp !== undefined && old.mrp !== null ? old.mrp : 0;

        await prisma.batches.update({
          where: {
            batchNo: old.batchNo,
          },
          data: {
            quantity: {
              increment: quantity,
            },
            total_amount: {
              increment: quantity * mrp,
            },
          },
        });
      });

      res.status(201).send({ message: "Memo Updated Successfully!" });
    } else {
      res.status(406).send({ message: "Memo Updation Failed!" });
    }
  } catch (error) {
    console.log("Error Updating memo:", error);
    res.status(500).send({ message: "Something went wrong. Server Error" });
  }
});

export default router;
