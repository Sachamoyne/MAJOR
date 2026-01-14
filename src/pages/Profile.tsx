import { useNavigate } from "react-router-dom";
import { MapPin, MoreHorizontal, ArrowLeft, Linkedin, Github, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BottomNav } from "@/components/BottomNav";
import { useProfile } from "@/hooks/useProfile";
import { useUserSkills } from "@/hooks/useUserSkills";
import { Skeleton } from "@/components/ui/skeleton";

const availabilityLabels: Record<string, string> = {
  "full-time": "Temps plein",
  "part-time": "Mi-temps",
  "evenings-weekends": "Soirs & weekends",
};

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: skills, isLoading: skillsLoading } = useUserSkills();

  const isLoading = profileLoading || skillsLoading;

  // Generate initials for fallback avatar
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate avatar URL or use initials
  const avatarUrl = profile?.avatar_url;
  const hasAvatar = !!avatarUrl;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[50vh] bg-secondary animate-pulse" />
        <div className="px-6 py-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                Modifier le profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Paramètres
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero Photo */}
      <div className="relative h-[50vh] w-full bg-secondary">
        {hasAvatar ? (
          <img
            src={avatarUrl}
            alt={profile?.name || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="h-32 w-32 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              {profile?.name ? (
                <span className="text-4xl font-bold text-primary">
                  {getInitials(profile.name)}
                </span>
              ) : (
                <User className="h-16 w-16 text-primary/50" />
              )}
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-10 pb-24">
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {profile?.name || "Utilisateur"}{profile?.age ? `, ${profile.age}` : ""}
          </h1>
          {profile?.city && (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm">{profile.city}</span>
            </div>
          )}
          {profile?.school && (
            <p className="text-sm text-muted-foreground mt-1">{profile.school}</p>
          )}
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-foreground/80 text-[15px] leading-relaxed mb-8">
            {profile.bio}
          </p>
        )}

        {/* Skills */}
        {skills?.owned && skills.owned.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Mes compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.owned.map((skill) => (
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
        {skills?.wanted && skills.wanted.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Je recherche
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.wanted.map((skill) => (
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
        {profile?.availability && (
          <div className="mb-10">
            <h2 className="text-xs font-medium text-primary uppercase tracking-wider mb-3">
              Disponibilité
            </h2>
            <span className="px-3 py-1.5 text-sm text-primary font-medium bg-primary/10 rounded-full">
              {availabilityLabels[profile.availability] || profile.availability}
            </span>
          </div>
        )}

        {/* Social Links */}
        {((profile as any)?.linkedin_url || (profile as any)?.github_url || (profile as any)?.twitter_url) && (
          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6">
              {(profile as any)?.linkedin_url && (
                <a
                  href={(profile as any).linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {(profile as any)?.github_url && (
                <a
                  href={(profile as any).github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {(profile as any)?.twitter_url && (
                <a
                  href={(profile as any).twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;