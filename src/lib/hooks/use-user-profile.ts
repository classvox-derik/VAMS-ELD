"use client";

import { useState, useEffect, useCallback } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
}

const STORAGE_KEY = "vams-user-profile";
const EMPTY: UserProfile = { firstName: "", lastName: "" };

/**
 * Loads the user profile from the database (primary) with localStorage as a
 * fast cache so the greeting doesn't flash empty on every page load.
 *
 * On save, writes to the database first, then mirrors to localStorage.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Immediately show cached value from localStorage, then fetch from DB.
  useEffect(() => {
    // Fast local cache
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    // Authoritative fetch from database
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("not authed");
        return res.json();
      })
      .then((data: UserProfile) => {
        const next: UserProfile = {
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
        };
        setProfile(next);
        // Mirror to localStorage for fast cache
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // If the API call fails (e.g. not logged in), keep whatever
        // localStorage had — better than showing nothing.
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // 2. Save to database, then update localStorage cache.
  const saveProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      const next = { ...profile, ...updates };
      setProfile(next);
      setIsSaving(true);

      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });

        if (!res.ok) throw new Error("save failed");

        // Mirror to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        return true;
      } catch {
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [profile]
  );

  return { profile, saveProfile, isLoaded, isSaving };
}
