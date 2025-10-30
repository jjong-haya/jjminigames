import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ENV } from "./config/env";
import healthRouter from "./routes/health.route";
import userRouter from "./routes/user.route";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
app.use(helmet());
app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/users", userRouter);

app.use(errorMiddleware);
export default app;
