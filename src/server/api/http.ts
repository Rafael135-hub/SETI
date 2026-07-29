import { NextResponse } from "next/server";

import { ApiError } from "./errors";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export function parseId(value: string, fieldName = "id") {
  if (!isUuid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return value;
}

export function parseOptionalUuid(value: string | null, fieldName: string) {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  if (!isUuid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return value;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function parseOptionalInteger(value: string | null, fieldName: string) {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }

  return parsed;
}

export function parseOptionalBoolean(value: string | null, fieldName: string) {
  if (value === null || value.trim() === "") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new ApiError(400, `Invalid ${fieldName}. Use true or false.`);
}

export async function handleRoute(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status },
      );
    }

    console.error(error);

    return json(
      {
        error: "Internal server error.",
      },
      { status: 500 },
    );
  }
}
