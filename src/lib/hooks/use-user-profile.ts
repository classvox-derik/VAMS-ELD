"use client";

import { useState, useEffect } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
}

const STORAGE_KEY = "vams-user-profile";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>({ firstName: "", lastName: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  function saveProfile(updates: Partial<UserProfile>) {
    const next = { ...profile, ...updates };
    setProfile(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  return { profile, saveProfile, isLoaded };
}
