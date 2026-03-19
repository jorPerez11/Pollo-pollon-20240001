import express from "express"
import employeeController from "../controllers/employeeController.js"

const router = express.Router()

router.route("/")
.get(employeeController.getEmployees)
.post(employeeController.inserEmployee)

router.route("/:id")
.put(employeeController.updateEmployee)
.delete(employeeController.deleteEmployee)

export default router