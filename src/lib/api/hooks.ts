"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { apiFetch, type ApiFetchOptions, type ApiResult } from "./client";

/**
 * Read hook. Returns the full ApiResult so callers can read `pagination`.
 */
export function useApiQuery<T>(
  key: readonly unknown[],
  path: string,
  options?: {
    query?: ApiFetchOptions["query"];
    enabled?: boolean;
  } & Omit<
    UseQueryOptions<ApiResult<T>, Error, ApiResult<T>, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) {
  const { query, ...rest } = options ?? {};
  return useQuery<ApiResult<T>, Error>({
    queryKey: key,
    queryFn: ({ signal }) => apiFetch<T>(path, { query, signal }),
    ...rest,
  });
}

/**
 * Write hook. `path` and `method` are fixed; the mutation variable is the body.
 * Pass `invalidate` with query-key prefixes to refetch after success.
 */
export function useApiMutation<TBody, TData = unknown>(
  path: string | ((body: TBody) => string),
  opts: {
    method?: ApiFetchOptions["method"];
    invalidate?: readonly (readonly unknown[])[];
  } & Omit<
    UseMutationOptions<ApiResult<TData>, Error, TBody>,
    "mutationFn"
  > = {},
) {
  const { method = "POST", invalidate, onSuccess, ...rest } = opts;
  const qc = useQueryClient();
  return useMutation<ApiResult<TData>, Error, TBody>({
    mutationFn: (body: TBody) =>
      apiFetch<TData>(typeof path === "function" ? path(body) : path, {
        method,
        body,
      }),
    ...rest,
    onSuccess: async (...args: Parameters<NonNullable<typeof onSuccess>>) => {
      if (invalidate) {
        await Promise.all(
          invalidate.map((queryKey) => qc.invalidateQueries({ queryKey })),
        );
      }
      await onSuccess?.(...args);
    },
  });
}
