import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Profile extends ProfileRow {}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface UserSkill {
  user_id: string;
  skill_id: string;
  type: "owned" | "wanted";
  skill?: Skill;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
}

export function useAllSkills() {
  return useQuery({
    queryKey: ["all-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("category", { ascending: true });

      if (error) throw error;
      return data as Skill[];
    },
  });
}

export function useUpdateUserSkills() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ownedSkillIds, wantedSkillIds }: { ownedSkillIds: string[]; wantedSkillIds: string[] }) => {
      if (!user) throw new Error("Not authenticated");

      // Suppression par id (qui est l'uuid utilisateur dans ta table)
      await supabase.from("user_skills").delete().eq("user_id", user.id);

      const newSkills = [
        ...ownedSkillIds.map((id) => ({ user_id: user.id, skill_id: id, type: "owned" })),
        ...wantedSkillIds.map((id) => ({ user_id: user.id, skill_id: id, type: "wanted" })),
      ];

      if (newSkills.length > 0) {
        const { error } = await supabase.from("user_skills").insert(newSkills);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-skills", user?.id] });
    },
  });
}
