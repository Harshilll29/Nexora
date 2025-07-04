import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT

app.set("trust proxy", 1);

app.use(cors({
    origin: "https://nexora-1.vercel.app",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})