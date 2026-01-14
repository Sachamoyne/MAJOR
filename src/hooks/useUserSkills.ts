import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SkillWithDetails {
  id: string;
  name: string;
  category: string | null;
  type: "owned" | "wanted";
}

export function useUserSkills(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ["user-skills", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return { owned: [], wanted: [] };

      const { data, error } = await supabase
        .from("user_skills")
        .select(`
          type,
          skill:skills(id, name, category)
        `)
        .eq("user_id", targetUserId);

      if (error) throw error;

      const owned: SkillWithDetails[] = [];
      const wanted: SkillWithDetails[] = [];

      data?.forEach((item) => {
        if (item.skill) {
          const skill = {
            id: (item.skill as any).id,
            name: (item.skill as any).name,
            category: (item.skill as any).category,
            type: item.type as "owned" | "wanted",
          };
          
          if (item.type === "owned") {
            owned.push(skill);
          } else {
            wanted.push(skill);
          }
        }
      });

      return { owned, wanted };
    },
    enabled: !!targetUserId,
  });
}