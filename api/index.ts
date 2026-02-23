import { handle } from "hono/vercel";
import app from "../packages/api/src/index.js";

export const config = {
  runtime: "edge",
};

export default handle(app);
