import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProfileView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile-view', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) throw error;

      // Get skills
      const { data: skillsData } = await supabase
        .from('user_skills')
        .select(`
          type,
          skills (
            id,
            name
          )
        `)
        .eq('user_id', id);

      return {
        ...profileData,
        owned_skills: (skillsData || []).filter((s: any) => s.type === 'owned').map((s: any) => s.skills),
        wanted_skills: (skillsData || []).filter((s: any) => s.type === 'wanted').map((s: any) => s.skills),
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Profil introuvable</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || profile.user_id}`;

  const availabilityLabels: Record<string, string> = {
    "full-time": "Temps plein",
    "part-time": "Temps partiel",
    "evenings-weekends": "Soirs & weekends",
  };

  const roleLabels: Record<string, string> = {
    technical: 'Tech',
    business: 'Business',
    product: 'Produit',
    generalist: 'Généraliste',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </header>

      {/* Photo */}
      <div className="relative h-[50vh] w-full">
        <img
          src={avatarUrl}
          alt={profile.name || 'Profil'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-10 pb-12">
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {profile.name || 'Anonyme'}{profile.age ? `, ${profile.age}` : ''}
          </h1>
          {profile.city && (
            <div className="flex items-center gap-1.5 mt-1 text-primary/70">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{profile.city}</span>
            </div>
          )}
          {profile.role && (
            <span className="inline-block mt-2 px-3 py-1 bg-secondary rounded-full text-sm">
              {roleLabels[profile.role] || profile.role}
            </span>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-foreground/80 text-[15px] leading-relaxed mb-8">
            {profile.bio}
          </p>
        )}

        {/* School */}
        {profile.school && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              École / Entreprise
            </h2>
            <p className="text-foreground">{profile.school}</p>
          </div>
        )}

        {/* Skills */}
        {profile.owned_skills && profile.owned_skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.owned_skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 text-sm text-foreground bg-secondary rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wanted Skills */}
        {profile.wanted_skills && profile.wanted_skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Recherche
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.wanted_skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 text-sm text-foreground border border-primary/20 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {profile.availability && (
          <div className="mb-10">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Disponibilité
            </h2>
            <span className="px-3 py-1.5 text-sm text-primary font-medium bg-primary/10 rounded-full">
              {availabilityLabels[profile.availability] || profile.availability}
            </span>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileView;
