import { createClient } from "@/lib/supabase";
import type { ScaffoldTemplate, ELLevel } from "@/types";

export async function getScaffoldTemplates(): Promise<ScaffoldTemplate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scaffold_templates")
    .select("*")
    .order("category", { ascending: true });

  if (error) throw error;
  return (data as ScaffoldTemplate[]) ?? [];
}

export async function getScaffoldsByElLevel(
  level: ELLevel
): Promise<ScaffoldTemplate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("scaffold_templates")
    .select("*")
    .contains("el_level_target", [level])
    .order("category", { ascending: true });

  if (error) throw error;
  return (data as ScaffoldTemplate[]) ?? [];
}
