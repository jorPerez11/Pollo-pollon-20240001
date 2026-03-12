import express from "express"

//Router() nos ayuda a colocar los métodos
//que tendrá mi endpoint

const router = express.Router();

router.route("/")
.get()
.post()

router,route("/:id")
.put()
.delete()

export default router;