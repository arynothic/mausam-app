import Fastify from "fastify";
import cors from "@fastify/cors";
import { PERSONA_DEFINITIONS } from "@mausam/shared";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", () => ({
  ok: true,
  service: "mausam-api",
  personas: PERSONA_DEFINITIONS.length,
}));

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await app.listen({ port, host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
