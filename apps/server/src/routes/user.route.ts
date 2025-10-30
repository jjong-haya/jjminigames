import { Router } from "express";
import { me } from "../controllers/user.controller";
const r = Router();

r.get("/me", me); // TODO: 인증 미들웨어 붙이기(추후)

export default r;
