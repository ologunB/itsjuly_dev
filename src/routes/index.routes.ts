// user.routes.ts

import express from "express";
import userRouter from "./user.routes";
import communityRouter from "./community.routes";

const router = express.Router();
router.use("/user", userRouter);
router.use("/community", communityRouter);

export default router;
