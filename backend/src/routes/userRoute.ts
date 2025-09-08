
import express, { Request, Response } from 'express';
const router = express.Router();

import { prisma } from '../db';

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'; 

//REGISTER:
router.post('/register', async (req: Request, res: Response) => {
    // const { username, role, password } = req.body;

    const username = "pragyanc";
    const role = "admin"; 
    
    const hashedPassword = await bcrypt.hash("helloPassword0023212", 10);
    
    try {
        const ifExist = await prisma.user.findUnique({
            where: {username}
        });
        
        if(ifExist?.username=== username) {
            res.status(409).send({ error: 'Email already exists!' });
        } else {
            const user = await prisma.user.create({
                data: {
                    username,
                    role,
                    password: hashedPassword,
                },
            });
    
            res.status(201).send({ message: 'User Created Successfully!' });
        }

    } catch (error) {
        res.status(400).json({ error: 'Something Went Wrong!' });
    }
});

//LOGIN:
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
 
    const user = await prisma.user.findUnique({
        where: {username}
    });

    if (!user) 
        return res.status(400).send({ message: 'No User Found With This Credentials' });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) 
        return res.status(400).send({ message: 'No User Found With This Credentials' });

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: '5d',
    });

    res.send({ token, message: "Logged In Successfully!" });
});

export default router;