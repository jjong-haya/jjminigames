import { Router } from "express";
const r = Router();

r.get("/", (_, res) => {
  res.json({ ok: true, ts: Date.now() });
});

export default r;
