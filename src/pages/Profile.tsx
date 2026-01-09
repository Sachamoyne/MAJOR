import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, MoreHorizontal, ArrowLeft, Pencil, Target, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  bio: "Étudiant à HEC Paris, je souhaite monter une licorne dans les 10 ans qui viennent. Passionné par la FinTech et les modèles économiques disruptifs.",
  location: "Paris",
  skills: [
    { name: "Finance", level: "expert" },
    { name: "Strategy", level: "expert" },
    { name: "Business Development", level: "intermediate" },
    { name: "Marketing", level: "intermediate" },
  ],
  wantedSkills: [
    { name: "CTO", priority: "must-have" },
    { name: "Développeur Fullstack", priority: "must-have" },
    { name: "Product Manager", priority: "nice-to-have" },
  ],
  availability: "Side Project",
  ambition: "unicorn",
};

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="font-semibold text-foreground">Mon Profil</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier le profil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Photo */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={`${userProfile.firstName} ${userProfile.lastName}`}
              className="w-32 h-32 rounded-2xl object-cover shadow-card-hover"
            />
          </div>
        </div>

        {/* Identity */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">
            {userProfile.firstName} {userProfile.lastName}
          </h2>
          <p className="text-muted-foreground">{userProfile.age} ans</p>
        </div>

        {/* Location Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {userProfile.location}
          </Badge>
        </div>

        {/* Bio */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-foreground text-sm leading-relaxed">
            {userProfile.bio}
          </p>
        </div>

        {/* Skills Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Mes compétences</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill) => (
              <Badge
                key={skill.name}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5"
              >
                {skill.name}
                <span className="ml-1.5 text-xs opacity-75">
                  • {skill.level === "expert" ? "Expert" : skill.level === "intermediate" ? "Opérationnel" : "Débutant"}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Wanted Skills Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <h3 className="font-medium text-foreground">Compétences recherchées</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.wantedSkills.map((skill) => (
              <Badge
                key={skill.name}
                variant="skill-wanted"
                className="px-3 py-1.5"
              >
                {skill.name}
                {skill.priority === "must-have" && (
                  <span className="ml-1.5 text-xs">★</span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-success" />
            <h3 className="font-medium text-foreground">Disponibilité</h3>
          </div>
          <Badge
            variant="excellent"
            className="px-3 py-1.5"
          >
            {userProfile.availability}
          </Badge>
        </div>

        {/* Edit Profile Button */}
        <div className="pt-4">
          <Button
            onClick={() => navigate("/onboarding")}
            className="w-full"
            size="lg"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier mon profil
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
