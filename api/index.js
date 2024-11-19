import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
dotenv.config();

const app = express();
mongoose
.connect(process.env.MONGO)
.then (() => {
console.log("COnnected to MOngoDB");
}).catch((err)=>{
    console.log(err);
})
app.listen(5174, () => {
    console.log("Server is running on port 5174");
}
);

app.use('/api/user', userRouter);