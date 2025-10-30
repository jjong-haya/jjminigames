import * as dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const EnvSchema = z.object({
  SERVER_PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

export const ENV = EnvSchema.parse(process.env);
