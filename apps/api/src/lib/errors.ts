import type { FastifyReply } from "fastify";
import type { ApiError } from "@mausam/shared";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function toErrorEnvelope(err: AppError): ApiError {
  return {
    error: {
      code: err.code,
      message: err.message,
      details: err.details,
    },
  };
}

export function sendError(reply: FastifyReply, err: AppError): FastifyReply {
  return reply.status(err.statusCode).send(toErrorEnvelope(err));
}

export function validationError(message: string, details?: unknown): AppError {
  return new AppError("VALIDATION_ERROR", message, 400, details);
}

export function notFoundError(message: string): AppError {
  return new AppError("NOT_FOUND", message, 404);
}

export function upstreamError(message: string, details?: unknown): AppError {
  return new AppError("UPSTREAM_ERROR", message, 502, details);
}
