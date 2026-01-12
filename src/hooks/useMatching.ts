import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MatchProfile {
  id: string;
  user_id: string;
  name: string | null;
  age: number | null;
  city: string | null;
  school: string | null;
  role: string | null;
  bio: string | null;
  availability: string | null;
  objective: string | null;
  avatar_url: string | null;
  owned_skills: string[];
  wanted_skills: string[];
  compatibility_score: number;
}

export interface Match {
  id: string;
  user_1: string;
  user_2: string;
  status: string;
  created_at: string;
  other_profile?: MatchProfile;
}

// Get complementary role
function getComplementaryRoles(role: string | null): string[] {
  if (role === 'technical') return ['business', 'product'];
  if (role === 'business') return ['technical', 'product'];
  if (role === 'product') return ['technical', 'business'];
  return ['technical', 'business', 'product', 'generalist'];
}

export function useMatchingProfiles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['matching-profiles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get current user's profile and skills
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const { data: myWantedSkills } = await supabase
        .from('user_skills')
        .select('skill_id')
        .eq('user_id', user.id)
        .eq('type', 'wanted');

      const myWantedSkillIds = (myWantedSkills || []).map(s => s.skill_id);
      const complementaryRoles = getComplementaryRoles(myProfile?.role);

      // Get profiles I've already liked or passed
      const { data: existingLikes } = await supabase
        .from('likes')
        .select('liked_id')
        .eq('liker_id', user.id);

      const likedUserIds = (existingLikes || []).map(l => l.liked_id);

      // Get active profiles with complementary roles (excluding self and already liked)
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .neq('user_id', user.id)
        .in('role', complementaryRoles);

      if (error) throw error;

      // Filter out already liked profiles
      const filteredProfiles = (profiles || []).filter(
        p => !likedUserIds.includes(p.user_id)
      );

      // Get skills for each profile
      const profilesWithSkills: MatchProfile[] = await Promise.all(
        filteredProfiles.map(async (profile) => {
          const { data: skills } = await supabase
            .from('user_skills')
            .select('skill_id, type')
            .eq('user_id', profile.user_id);

          const ownedSkills = (skills || [])
            .filter(s => s.type === 'owned')
            .map(s => s.skill_id);
          
          const wantedSkills = (skills || [])
            .filter(s => s.type === 'wanted')
            .map(s => s.skill_id);

          // Calculate compatibility score
          let score = 0;
          myWantedSkillIds.forEach(wantedId => {
            if (ownedSkills.includes(wantedId)) {
              score += 1;
            }
          });

          return {
            ...profile,
            owned_skills: ownedSkills,
            wanted_skills: wantedSkills,
            compatibility_score: score,
          };
        })
      );

      // Sort by compatibility score (descending)
      return profilesWithSkills.sort((a, b) => b.compatibility_score - a.compatibility_score);
    },
    enabled: !!user,
  });
}

export function useLikeProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (likedUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      // Insert like
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          liker_id: user.id,
          liked_id: likedUserId,
        });

      if (likeError) throw likeError;

      // Check if there's a reciprocal like
      const { data: reciprocalLike } = await supabase
        .from('likes')
        .select('id')
        .eq('liker_id', likedUserId)
        .eq('liked_id', user.id)
        .maybeSingle();

      if (reciprocalLike) {
        // Create a match!
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .insert({
            user_1: user.id,
            user_2: likedUserId,
            status: 'active',
          })
          .select()
          .single();

        if (matchError) throw matchError;

        // Create initial message
        await supabase
          .from('messages')
          .insert({
            match_id: match.id,
            sender_id: user.id,
            content: "C'est un match ! 🎉 Commencez à discuter.",
          });

        return { isMatch: true, matchId: match.id };
      }

      return { isMatch: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matching-profiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['matches', user?.id] });
    },
  });
}

export function useMatches() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['matches', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get other user's profile for each match
      const matchesWithProfiles: Match[] = await Promise.all(
        (matches || []).map(async (match) => {
          const otherUserId = match.user_1 === user.id ? match.user_2 : match.user_1;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', otherUserId)
            .single();

          return {
            ...match,
            other_profile: profile ? {
              ...profile,
              owned_skills: [],
              wanted_skills: [],
              compatibility_score: 0,
            } : undefined,
          };
        })
      );

      return matchesWithProfiles;
    },
    enabled: !!user,
  });
}
