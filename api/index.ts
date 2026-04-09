import { handle } from "hono/vercel";
import app from "../packages/api/src/index.js";

export const config = {
  runtime: "nodejs",
  maxDuration: 30,
};

export default handle(app);
