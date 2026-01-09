import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProfiles } from "@/data/mockProfiles";

const ProfileView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const profile = mockProfiles.find((p) => p.id === id);

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

  const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`;

  const availabilityLabels: Record<string, string> = {
    "full-time": "Temps plein",
    "part-time": "Temps partiel",
    "evenings-weekends": "Soirs & weekends",
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
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-10 pb-12">
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.location && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-foreground/80 text-[15px] leading-relaxed mb-8">
          {profile.bio}
        </p>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((userSkill) => (
              <span
                key={userSkill.skill.id}
                className="px-3 py-1.5 text-sm text-foreground bg-secondary/50 rounded-full"
              >
                {userSkill.skill.name}
                {userSkill.level === "expert" && " ⭐"}
              </span>
            ))}
          </div>
        </div>

        {/* Wanted Skills */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Recherche
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.wantedSkills.map((wantedSkill) => (
              <span
                key={wantedSkill.skill.id}
                className="px-3 py-1.5 text-sm text-foreground border border-border rounded-full"
              >
                {wantedSkill.skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-10">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Disponibilité
          </h2>
          <span className="px-3 py-1.5 text-sm text-primary font-medium border border-primary/20 rounded-full">
            {availabilityLabels[profile.availability] || profile.availability}
          </span>
        </div>

        {/* Social Links */}
        {profile.linkedIn && (
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center justify-center">
              <a
                href={profile.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-border/80 text-foreground/70 hover:text-primary hover:border-primary/30 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileView;
