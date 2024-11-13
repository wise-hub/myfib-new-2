import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const clearSessionAndRedirect = () => {
  sessionStorage.clear();
  document.cookie = "logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/login";
};

export const useApi = () => {
  const navigate = useNavigate();

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}, ebankref: string) => {
      const token = sessionStorage.getItem("token");
      const customer = sessionStorage.getItem("customer") || "";

      if (!token) {
        clearSessionAndRedirect();
        return;
      }

      const headers = new Headers(options.headers || {});
      headers.append("token", token);
      headers.append("customer", customer);
      headers.append("ebankref", ebankref);

      const url = `http://localhost:5000/${endpoint}`;
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (response.status === 401) {
          clearSessionAndRedirect();
        } else if (!response.ok) {
          const errorDetails = await response.json().catch(() => ({}));
          throw new Error(
            `Request failed with status ${response.status}: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        console.error(
          "API call error:",
          error instanceof Error ? error.message : error
        );
        throw error;
      }
    },
    []
  );

  return apiCall;
};
