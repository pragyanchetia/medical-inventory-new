import express, { Request, Response } from "express";
import multer from 'multer';

import path from 'path';
import fs from 'fs';  

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.get("/download-backup-data", async (req: Request, res: Response) => {
    try {
        const databasePath = path.join(__dirname, '..', 'prisma', 'dev.db');
        if (fs.existsSync(databasePath)) { 
            res.download(databasePath, 'dev.db', (err) => {
                if (err) { 
                    res.status(500).send({message: 'Error downloading the backup!'});
                }  
            });
        } else {
            res.status(404).send({message: 'Backup Not Found!'});
        } 
    } catch (error) { 
      res.status(500).send({ message: "Server Error while Database backup !", error });
    }
  }
);

router.post("/upload-backup", upload.single('backup'), (req: Request, res: Response) => {
    const uploadedFilePath: string = req.file?.path as string;

    const targetPath = path.join(__dirname, '..', 'prisma', 'dev.db');

    console.log(targetPath);

    fs.rename(uploadedFilePath, targetPath, (err) => {
        if (err) {
            fs.unlink(uploadedFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Failed to delete uploaded file:', unlinkErr);
                }
            });
            return res.status(500).send({message: 'Error Restoring the Backup!'});
        }
        res.send({message: 'Backup Restored Successfully!'});
    });
});

export default router;
