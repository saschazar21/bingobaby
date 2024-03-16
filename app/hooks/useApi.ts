import { useCallback, useEffect, useState } from "react";

const config: RequestInit = {
  credentials: "same-origin",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
  },
  method: "GET",
};

export const useLazyApi = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = useCallback(async (body: Record<string, string> | null) => {
    setError(null);
    setIsLoading(true);

    return fetch(url, {
      ...config,
      body: body ? new URLSearchParams(body).toString() : body,
      method,
    })
      .then((res) => res.json())
      .catch((e) => setError((e as Error).message))
      .finally(() => setIsLoading(false));
  }, [method, url]);

  return { error, isLoading, submit };
};

export const useApi = (
  url: string,
  body: Record<string, string> | null,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
) => {
  const [data, setData] = useState<
    Record<string, unknown> | Record<string, unknown>[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    fetch(url, {
      ...config,
      body: body ? new URLSearchParams(body).toString() : body,
      method,
    })
      .then((res) => res.json())
      .then(setData)
      .catch((e) => setError((e as Error).message))
      .finally(() => setIsLoading(false));
  }, [url, body, method]);

  return { data, error, isLoading };
};
