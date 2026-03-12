//creo un array de metodos
const productsController = {};
//importar el schema de la coleccion que voy a ocupar
import productsModel from "../models/products";

//SELECT        
productsController.getProducts = async(req, res) => {
    const products = await productsModel.find()
    res.json(products)
}

//insert
productsController.insertProducts = async(req, res) => {
    const{name, description, price, stock} = req.body;
    const newProduct = new productsModel({name, description, price, stock})
    await newProduct.save()
    res.json({message: "Product save"})
}

//update
productsController.updateProducts = async (req, res) => {
    const {name, description, price, stock} = req.body;
    await productsModel.findByIdAndUpdate(req.params.id, {
        name, description, price, stock
    }, {new: true})

    res.json({message: "product update"})
}