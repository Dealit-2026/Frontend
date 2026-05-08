export class ApiRequestError extends Error {
  status: number;
  code: string | null;

  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export interface ApiErrorDetail {
  message: string;
  code: string | null;
}

export async function getApiErrorDetail(
  response: Response,
  fallbackMessage: string,
): Promise<ApiErrorDetail> {
  try {
    const data = await response.json();

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError?.reason === "string" && firstError.reason.trim()) {
        return {
          message: firstError.reason,
          code: typeof data?.code === "string" ? data.code : null,
        };
      }
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return {
        message: data.message,
        code: typeof data?.code === "string" ? data.code : null,
      };
    }
  } catch {
    // Ignore body parsing failures and use fallback below.
  }

  return {
    message: `${fallbackMessage} (${response.status})`,
    code: null,
  };
}

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
) {
  const detail = await getApiErrorDetail(response, fallbackMessage);
  return detail.message;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallbackMessage;
}
