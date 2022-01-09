// import libraries
import express from "express";
// import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import "./config/db_connection.mjs"

// import controller
import productRouter from "./controller/Products.mjs";
import categoryRoutes from "./controller/Category.mjs";
import userRoutes from "./controller/User.mjs";
import orderRouter from "./controller/Orders.mjs";

// import helper
import authJWT from "./helpers/jwt.mjs"
import errorHandler from "./helpers/error-handler.mjs"
// env. Variables
const API_URL = process.env.API_URL;
const PORT = process.env.PORT || 3001;

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJWT());
app.use(errorHandler)
// Routes
app.use(`${API_URL}/product`, productRouter)
app.use(`${API_URL}/category`, categoryRoutes)
app.use(`${API_URL}/user`, userRoutes)
app.use(`${API_URL}/order`, orderRouter)


app.listen(PORT);
