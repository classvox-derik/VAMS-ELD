"use client";

import { useEffect, useState } from "react";
import { useUserProfile } from "@/lib/hooks/use-user-profile";

const GREETINGS = [
  (name: string) => `Welcome back, ${name}!`,
  (name: string) => `Good to see you, ${name}!`,
  (name: string) => `Ready to inspire, ${name}?`,
  (name: string) => `Let's make a difference today, ${name}!`,
  (name: string) => `Hey ${name}, your students need you!`,
  (name: string) => `You're doing great work, ${name}!`,
  (name: string) => `Another great day to scaffold, ${name}!`,
  (name: string) => `Rise and shine, ${name}!`,
  (name: string) => `Hello, ${name}! Let's get to it.`,
  (name: string) => `Welcome, ${name} — let's inspire some learners!`,
];

const FALLBACK = "Welcome back!";

export function DashboardGreeting() {
  const { profile, isLoaded } = useUserProfile();
  const [greeting, setGreeting] = useState(FALLBACK);

  useEffect(() => {
    if (!isLoaded) return;
    const name = profile.firstName.trim();
    if (name) {
      const index = Math.floor(Math.random() * GREETINGS.length);
      setGreeting(GREETINGS[index](name));
    } else {
      setGreeting(FALLBACK);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return <>{greeting}</>;
}
