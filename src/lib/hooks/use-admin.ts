"use client";

import { useState, useEffect } from "react";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/role")
      .then((res) => res.json())
      .then((data: { role: string }) => {
        setIsAdmin(data.role === "admin");
      })
      .catch(() => {
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { isAdmin, isLoading };
}
