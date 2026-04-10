/*
    Campos:
        name:
        lastName:
        salary:
        DUI:
        phone:
        email:
        password:
        idBranch:
*/

import mongoose, { Schema, model } from "mongoose"

const employeeSchema = new Schema({
    name:{
        type: String
    },
    lastName: {
        type: String
    },
    salary:{
        type: Number
    },
    DUI:{
        type: String
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    idBranch:{
        // type: mongoose.Schema.Types.ObjectId, ref: "Branches", establece una relación entre el campo idBranch en el esquema de empleados y la colección de sucursales (Branches) en la base de datos. Esto permite que cada empleado esté asociado con una sucursal específica
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branches"
    }
}, {
    // timestamps: true, agrega automáticamente campos de fecha de creación y actualización a los documentos de la colección, lo que facilita el seguimiento de cuándo se crearon o modificaron los registros.
    timestamps: true,
    // strict: false, permite agregar campos adicionales a los documentos de la colección, lo que facilita la flexibilidad en la estructura de los datos.
    strict: false
})

//"Employees" es el nombre de la colección que se guarda en la DB
export default model("Employees", employeeSchema)