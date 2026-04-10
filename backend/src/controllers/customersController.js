import customerModel from "../models/customers.js"

const customerController = {};

customerController.getCustomer = async (req, res) => {
    try{
        const customers = await customerModel.find()
        return res.status(200).json(customers)
    }catch(error){
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

customerController.deleteCustomer = async (req, res) => {
    try{
        const deletedCustomer = await customerModel.findByIdAndDelete(req.params.id)

        if(!deletedCustomer){
            return res.status(404).json({message: "Customer not found"})
        }
        return res.status(200).json({message: "Customer deleted"})

    }catch(error){
        console.log(error + "error")
        return res.status(500).json({message: "Internal server error"})
    }
}

customerController.updateCustomer = async (req, res) => {

    try{
        const{
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttempts,
            timeOut
        } = req.body

        name = name?.trim();
        email = email?.trim();

        if (name.lenght < 3 || name.lenght > 15){
            return res.status(400).json({message: "Invalid name"})
        }

        if(birthdate > new Date() || birthdate < new Date("1900-01-01")){
            return res.status(400).json({message: "Invalid birthdate"})
        }

        const updateCustomer = await customerModel.findByIdAndUpdate( 
            req.params.id,{
                name,
                lastName,
                birthdate,
                email,
                password, 
                isVerified,
                loginAttempts,
                timeOut,
            }, {new: true}
        );

        if(!updateCustomer){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer updated"})

    }catch(error){
        console.log("error"+ error);
        return res.status(500).json({message: "Internal server error"})
    }
};

export default customerController