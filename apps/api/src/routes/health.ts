import type { FastifyInstance } from "fastify";
import { PERSONA_DEFINITIONS } from "@mausam/shared";

export function registerHealthRoutes(app: FastifyInstance): void {
  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              service: { type: "string" },
              personas: { type: "number" },
            },
          },
        },
      },
    },
    () => ({
      ok: true,
      service: "mausam-api",
      personas: PERSONA_DEFINITIONS.length,
    }),
  );
}
