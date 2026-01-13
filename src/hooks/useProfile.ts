import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Schema matching external Supabase: profiles.id = auth.uid()
export interface Profile {
  id: string;
  full_name: string | null;
  age: number | null;
  city: string | null;
  education: string | null;
  role_primary: string | null;
  target_role: string | null;
  has_project: boolean | null;
  ambition_level: string | null;
  commitment_hours: number | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
}

export interface UserSkill {
  id: string;
  skill_id: string;
  type: 'owned' | 'wanted';
  skill: Skill;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // profiles.id = auth.uid() in external database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      // Cast to any to handle external schema differences
      return data as unknown as Profile | null;
    },
    enabled: !!user,
  });
}

export function useUserSkills() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-skills', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          id,
          skill_id,
          type,
          skills (
            id,
            name,
            category
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        skill_id: item.skill_id,
        type: item.type as 'owned' | 'wanted',
        skill: item.skills as Skill,
      })) as UserSkill[];
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<Profile, 'id'>>) => {
      if (!user) throw new Error('Not authenticated');
      
      // Use .update() with filter by id (which equals auth.uid())
      const { data, error } = await supabase
        .from('profiles')
        .update(updates as any)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}

export function useAllSkills() {
  return useQuery({
    queryKey: ['all-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
}

export function useUpdateUserSkills() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      ownedSkillIds, 
      wantedSkillIds 
    }: { 
      ownedSkillIds: string[]; 
      wantedSkillIds: string[];
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      // Delete existing skills
      await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id);
      
      // Insert new owned skills
      if (ownedSkillIds.length > 0) {
        const ownedSkills = ownedSkillIds.map(skill_id => ({
          user_id: user.id,
          skill_id,
          type: 'owned' as const,
        }));
        
        const { error: ownedError } = await supabase
          .from('user_skills')
          .insert(ownedSkills);
        
        if (ownedError) throw ownedError;
      }
      
      // Insert new wanted skills
      if (wantedSkillIds.length > 0) {
        const wantedSkills = wantedSkillIds.map(skill_id => ({
          user_id: user.id,
          skill_id,
          type: 'wanted' as const,
        }));
        
        const { error: wantedError } = await supabase
          .from('user_skills')
          .insert(wantedSkills);
        
        if (wantedError) throw wantedError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-skills', user?.id] });
    },
  });
}
