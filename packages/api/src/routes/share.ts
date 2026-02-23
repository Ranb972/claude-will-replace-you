import { Hono } from "hono";
import { getResult, incrementShareCount } from "../lib/db.js";

const share = new Hono();

share.post("/:id/share", async (c) => {
  const { id } = c.req.param();

  const row = await getResult(id);
  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  await incrementShareCount(id);

  return c.json({ success: true });
});

export default share;
