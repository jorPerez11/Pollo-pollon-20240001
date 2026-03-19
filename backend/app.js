import express from "express"
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeeRoutes from "./src/routes/employee.js"

//Ejecutar express
const app = express();

app.use(express.json())

//Creamos los endpoints

app.use("/api/products", productsRoutes)
app.use("/api/branches", branchesRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/reviews", reviewsRoutes)

export default app;

