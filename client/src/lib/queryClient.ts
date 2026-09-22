import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export function leadSubmissionError(error: unknown): string {
  if (error instanceof Error && error.message.startsWith("503:")) {
    return "Your request was not saved because online requests are temporarily unavailable. Please call 941-210-1663.";
  }
  if (error instanceof Error && error.message.startsWith("429:")) {
    return "Too many attempts. Please wait a few minutes before trying again, or call 941-210-1663.";
  }
  return "We could not confirm that your request was saved. Please call 941-210-1663 or try again later.";
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  /** Extra request headers (e.g. an admin Bearer token entered at runtime). */
  headers?: Record<string, string>,
  signal?: AbortSignal,
): Promise<Response> {
  const res = await fetch(`${API_BASE}${url}`, {
    method,
    signal,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(`${API_BASE}${queryKey.join("/")}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
