import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import logger from "./middleware/logger.js";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";

const apiLimiter=rateLimit({
  windowMs:15*60*1000,
  max:10,
  message:{error:"Too many requests from this IP, please try again after 15 minutes"},
})


dotenv.config();
ConnectDB(); // database connection

const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

//health-route
app.get("/health",(req,res)=>{
  res.status(200).json({msg:"OK"});
})
app.use("/api/auth",authRoutes);
app.use("/api/summarize",apiLimiter,summarizeRoutes);


app.listen(PORT,()=>{
  console.log("Server running at "+PORT);
})