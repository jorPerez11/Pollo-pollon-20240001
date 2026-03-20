import express from 'express';

import providersController from '../controllers/providersController.js';

//Usamos la funcion Router() de la libreria express
//para acceder a los metodos get, post, put y delete
const router = express.Router();

//Rutas para los proveedores
router.route("/")
.get(providersController.getProviders)
.post(providersController.insertProviders);

router.route("/:id")
.put(providersController.updateProviders)
.delete(providersController.deleteProviders);

export default router;