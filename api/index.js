import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO).then (() => {
console.log("COnnected to MOngoDB");
}).catch((err)=>{
    console.log(err);
})
app.listen(5174, () => {
    console.log("Server is running on port 5174");
}
);

