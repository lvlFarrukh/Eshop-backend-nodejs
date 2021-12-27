// import libraries
import express from "express";
// import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import "./config/db_connection.mjs"

// import controller
import productRouter from "./controller/Products.mjs";

// env. Variables
const API_URL = process.env.API_URL;
const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));

// Routes
app.use(`${API_URL}/product`, productRouter)


app.listen(PORT);
