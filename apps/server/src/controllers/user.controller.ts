import { Request, Response } from "express";

export async function me(req: Request, res: Response) {
  // TODO: Firebase Admin 인증 연동 시 실제 사용자 정보 반환
  return res.json({ user: null, note: "auth wiring TBD" });
}
