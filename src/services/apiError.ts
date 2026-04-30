export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const data = await response.json();

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError?.reason === "string" && firstError.reason.trim()) {
        return firstError.reason;
      }
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Ignore body parsing failures and use the fallback below.
  }

  return `${fallbackMessage} (${response.status})`;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallbackMessage;
}
