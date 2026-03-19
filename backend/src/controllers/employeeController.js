//Creo un array de funciones
const employeeController = {};

//Importo el model que voy a utilizar
import employeeModel from "../models/employee.js";

//SELECT
employeeController.getEmployees = async (req , res) =>{
    const employees = await employeeModel.find()
    res.json(employees)
};

//INSERT 
employeeController.inserEmployee = async (req, res) =>{
    //#1- Solicitar los datos
    const {name, lastName, salary, DUI, phone, email, password, idBranch} = req.body
    //#2- Lleno mi modelo con esos datos que acabo de pedir
    const newEmployee = new employeeModel({name, lastName, salary, DUI, phone, email, password, idBranch})
    //#3- Guardo todo en la base de datos
    await newEmployee.save()

    res.json({message: "Employee saved"})
};

//ACTUALIZAR 
employeeController.updateEmployee = async (req, res) => {
    const {name, lastName, salary, DUI, phone, email, password, idBranch} = req.body

    //actualizo
    await employeeModel.findByIdAndUpdate(
        req.params.id,{
            name, lastName, salary, DUI, phone, email, password, idBranch,}, {new: true}
    );

    res.json({message: "Employee updated"})
}

//Eliminar
employeeController.deleteEmployee = async (req, res) =>{
    await employeeModel.findByIdAndDelete(req.params.id)
    res.json({message: "Employee deleted"})
}

export default employeeController;