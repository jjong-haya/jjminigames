import app from "./app";
import { ENV } from "./config/env";

const port = ENV.SERVER_PORT;
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});
