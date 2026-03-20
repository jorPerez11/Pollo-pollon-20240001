const providersController = {};
import providersModels from "../models/providers.js";

// SELECT
providersController.getProviders = async(req, res) => {
    try {
        const providers = await providersModels.find();
        return res.status(200).json(providers);
    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// INSERT
providersController.insertProviders = async(req, res) => {
    try {
        let { name, birthday, height, DUI, phone } = req.body;

        name = name?.trim();
        DUI = DUI?.trim();
        phone = phone?.trim();

        if (!name || !DUI || !phone) {
            return res.status(400).json({message: "Field required"});
        }

        if(name.length < 3) return res.status(400).json({message: "name too short"});
        if(DUI.length > 10 || DUI.length < 9) return res.status(400).json({message: "DUI not valid"});

        const birthDate = new Date(birthday);
        if(birthDate > new Date() || birthDate < new Date("1910-01-01")){
            return res.status(400).json({message: "Invalid date"});
        }

        const newProvider = new providersModels({name, birthday, height, DUI, phone});
        await newProvider.save();
        return res.status(201).json({message: "Provider created"});

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// UPDATE
providersController.updateProviders = async(req, res) => {
    try {
        let { name, birthday, height, DUI, phone } = req.body;
        const providerId = req.params.id;

        // Limpieza de datos
        name = name?.trim();
        DUI = DUI?.trim();
        phone = phone?.trim();
        // Nota: NO usamos .trim() en height porque es Number

        // Validaciones (Corregido 'length')
        if(name && name.length < 3) return res.status(400).json({message: "name too short"});
        if(DUI && (DUI.length > 10 || DUI.length < 9)) return res.status(400).json({message: "DUI not valid"});

        const updatedProvider = await providersModels.findByIdAndUpdate(
            providerId, 
            { name, birthday, height, DUI, phone }, 
            { new: true, runValidators: true } // runValidators obliga a respetar el Schema
        );

        if (!updatedProvider) return res.status(404).json({message: "Provider not found"});
        
        return res.status(200).json({message: "Provider updated", provider: updatedProvider});

    } catch (error) {
        console.log("error: " + error);
        return res.status(500).json({message: "Internal server error"});
    }   
}

// DELETE (Este estaba bien, lo dejo igual)
providersController.deleteProviders = async(req, res) => {
    try {
        const deletedProvider = await providersModels.findByIdAndDelete(req.params.id);
        if (!deletedProvider) return res.status(404).json({message: "Provider not found"});
        return res.status(200).json({message: "Provider deleted"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

export default providersController;