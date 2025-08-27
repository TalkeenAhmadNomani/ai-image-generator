import express from "express";
import {
  getDalleMessage,
  generateImage,
} from "../controllers/dalleController.js";

const router = express.Router();

router.get("/", getDalleMessage);
router.post("/", generateImage);

export default router;
