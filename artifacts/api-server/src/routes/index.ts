import { Router, type IRouter } from "express";
import healthRouter from "./health";
import imageRouter from "./image";
import storyTextRouter from "./storyText";
import ttsRouter from "./tts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(imageRouter);
router.use(storyTextRouter);
router.use(ttsRouter);

export default router;
