import { useNavigate } from "react-router-dom";
import { MapPin, MoreHorizontal, ArrowLeft, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user profile data
const userProfile = {
  firstName: "Alexandre",
  lastName: "Martin",
  age: 24,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
  bio: "Étudiant à HEC Paris, je souhaite monter une licorne dans les 10 ans qui viennent. Passionné par la FinTech et les modèles économiques disruptifs.",
  location: "Paris",
  skills: [
    { name: "Finance", level: "expert" },
    { name: "Strategy", level: "expert" },
    { name: "Business Dev", level: "intermediate" },
    { name: "Marketing", level: "intermediate" },
  ],
  wantedSkills: [
    { name: "CTO", priority: "must-have" },
    { name: "Fullstack Dev", priority: "must-have" },
    { name: "Product Manager", priority: "nice-to-have" },
  ],
  availability: "Side Project",
  linkedIn: "https://linkedin.com/in/alexandremartin",
  github: "https://github.com/alexandremartin",
};

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Minimal */}
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
            <DropdownMenuContent align="end" className="bg-white border-border/50">
              <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                Modifier le profil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero Photo - 50% height */}
      <div className="relative h-[50vh] w-full">
        <img
          src={userProfile.avatar}
          alt={`${userProfile.firstName} ${userProfile.lastName}`}
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <main className="px-6 -mt-6 relative z-10 pb-12">
        {/* Identity */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {userProfile.firstName} {userProfile.lastName}, {userProfile.age}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm">{userProfile.location}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-foreground/80 text-[15px] leading-relaxed mb-8">
          {userProfile.bio}
        </p>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Mes compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill) => (
              <span
                key={skill.name}
                className="px-3 py-1.5 text-sm text-foreground bg-secondary/50 rounded-full"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Wanted Skills */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Je recherche
          </h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.wantedSkills.map((skill) => (
              <span
                key={skill.name}
                className="px-3 py-1.5 text-sm text-foreground border border-border rounded-full"
              >
                {skill.name}
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
            {userProfile.availability}
          </span>
        </div>

        {/* Social Links */}
        {(userProfile.linkedIn || userProfile.github) && (
          <div className="pt-6 border-t border-border/50">
            <div className="flex items-center justify-center gap-6">
              {userProfile.linkedIn && (
                <a
                  href={userProfile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border/80 text-foreground/70 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {userProfile.github && (
                <a
                  href={userProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-border/80 text-foreground/70 hover:text-primary hover:border-primary/30 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
