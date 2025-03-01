import express from "express";
import { UserController } from "../../controllers/user.controller";


const router = express.Router();

router.post("/", UserController.create as any);
router.post("/:username", UserController.verifyUsername as any);
router.patch("/:username/score", UserController.updateUserScore as any);


export default router;