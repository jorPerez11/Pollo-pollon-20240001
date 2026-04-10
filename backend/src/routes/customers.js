import express from "express";
import customerController from "../controllers/customersController.js"

const router = express.Router();

router.route("/")
.get(customerController.getCustomer);

router.route("/:id")
    .put(customerController.updateCustomer)
    .delete(customerController.deleteCustomer)

export default router;