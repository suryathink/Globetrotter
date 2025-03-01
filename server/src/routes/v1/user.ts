import express from "express";
import { UserController } from "../../controllers/user.controller";


const router = express.Router();

router.post("/", UserController.create as any);


export default router;