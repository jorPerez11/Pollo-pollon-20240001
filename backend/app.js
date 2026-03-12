import express from "express"
import productsRoutes from "./src/models/products";

//Ejecutar express
const app = express();

//Creamos los endpoints

app.use("/api/products", productsRoutes);

export default app;

