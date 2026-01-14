import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { AvatarUpload } from "@/components/AvatarUpload";
import { PremiumCard, SkillChip } from "@/components/PremiumCard";
import { ArrowRight, ArrowLeft, Linkedin, Github } from "lucide-react";
import { useUpdateProfile, useAllSkills, useUpdateUserSkills, useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const stepLabels = ["Profil", "Rôle", "Compétences", "Recherche", "Disponibilité", "Réseaux"];

type Role = "Tech" | "Business" | "Design" | "Marketing" | "Product" | "Operations" | "Other";

const roles: { id: Role; label: string; description: string; icon: string }[] = [
  { id: "Tech", label: "Tech", description: "Développement, data, infrastructure", icon: "💻" },
  { id: "Design", label: "Design", description: "Product design, UX/UI", icon: "🎨" },
  { id: "Product", label: "Product", description: "Product management, stratégie produit", icon: "📱" },
  { id: "Business", label: "Business", description: "Vente, stratégie, finance", icon: "💼" },
  { id: "Marketing", label: "Marketing", description: "Growth, acquisition, branding", icon: "📈" },
  { id: "Operations", label: "Operations", description: "Ops, RH, logistique", icon: "⚙️" },
  { id: "Other", label: "Autre", description: "Généraliste ou autre domaine", icon: "🔄" },
];

const availabilities = [
  { id: "full-time", label: "Temps plein", description: "Prêt à m'investir à 100%", icon: "🚀" },
  { id: "part-time", label: "Mi-temps", description: "15-25h par semaine", icon: "⚡" },
  { id: "evenings-weekends", label: "Soirs & weekends", description: "Side project pour l'instant", icon: "🌙" },
];

const objectives = [
  { id: "find-cofounder", label: "Trouver un co-fondateur", description: "Je cherche mon associé(e)", icon: "🤝" },
  { id: "join-project", label: "Rejoindre un projet", description: "Je veux intégrer une équipe", icon: "🎯" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: allSkills } = useAllSkills();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateUserSkills();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    age: "",
    city: "",
    school: "",
    avatar_url: null as string | null,
    role: null as Role | null,
    ownedSkillIds: [] as string[],
    wantedSkillIds: [] as string[],
    availability: "",
    objective: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
  });

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        name: profile.name || "",
        age: profile.age?.toString() || "",
        city: profile.city || "",
        school: profile.school || "",
        avatar_url: profile.avatar_url || null,
        role: (profile.role as Role) || null,
        availability: profile.availability || "",
        objective: profile.objective || "",
        linkedin_url: (profile as any).linkedin_url || "",
        github_url: (profile as any).github_url || "",
        twitter_url: (profile as any).twitter_url || "",
      }));
    }
  }, [profile]);

  const updateData = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // Save progress at each step
  const saveStepProgress = async () => {
    try {
      await updateProfile.mutateAsync({
        name: data.name.trim() || null,
        age: data.age ? parseInt(data.age, 10) : null,
        city: data.city.trim() || null,
        school: data.school.trim() || null,
        avatar_url: data.avatar_url,
        role: data.role,
        availability: data.availability || null,
        objective: data.objective || null,
        linkedin_url: data.linkedin_url.trim() || null,
        github_url: data.github_url.trim() || null,
        twitter_url: data.twitter_url.trim() || null,
      } as any);
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  };

  const handleNext = async () => {
    if (currentStep < 6) {
      await saveStepProgress();
      setCurrentStep(currentStep + 1);
    } else {
      try {
        toast.loading("Finalisation de votre profil...");

        // 1. Sauvegarde finale des données textuelles
        await saveStepProgress();

        // 2. Sauvegarde des compétences
        await updateSkills.mutateAsync({
          ownedSkillIds: data.ownedSkillIds,
          wantedSkillIds: data.wantedSkillIds,
        });

        // 3. IMPORTANT : Marquer l'onboarding comme terminé
        await updateProfile.mutateAsync({
          onboarding_completed: true,
        } as any);

        // 4. Invalidation du cache pour être sûr
        await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });

        toast.success("Profil complété avec succès !");

        // 5. HARD REDIRECT : On force le navigateur à recharger sur /home
        // Cela garantit que le ProtectedRoute lise la version fraîche de la BDD
        window.location.href = "/home";
      } catch (error) {
        console.error("Error during onboarding finalization:", error);
        toast.error("Erreur lors de la finalisation.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!(data.name && data.age && data.city);
    if (currentStep === 2) return !!data.role;
    if (currentStep === 3) return data.ownedSkillIds.length > 0;
    if (currentStep === 4) return data.wantedSkillIds.length > 0;
    if (currentStep === 5) return !!(data.availability && data.objective);
    if (currentStep === 6) return true; // Social links are optional
    return false;
  };

  // Group skills by category
  const skillsByCategory = allSkills?.reduce(
    (acc, skill) => {
      const category = skill.category || "Autres";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, typeof allSkills>,
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="container max-w-2xl mx-auto">
          <OnboardingProgress currentStep={currentStep} totalSteps={6} stepLabels={stepLabels} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-xl mx-auto py-8 px-4">
        {/* Step 1: Personal Info + Avatar */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Créez votre profil</h2>
              <p className="text-muted-foreground mt-2">Présentez-vous aux autres fondateurs</p>
            </div>

            <AvatarUpload currentUrl={data.avatar_url} onUpload={(url) => updateData("avatar_url", url)} />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Prénom</label>
                <Input
                  placeholder="Votre prénom"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  className="h-12 bg-card border-border focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Âge</label>
                  <Input
                    placeholder="25"
                    type="number"
                    value={data.age}
                    onChange={(e) => updateData("age", e.target.value)}
                    className="h-12 bg-card border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ville</label>
                  <Input
                    placeholder="Paris"
                    value={data.city}
                    onChange={(e) => updateData("city", e.target.value)}
                    className="h-12 bg-card border-border focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">École / Entreprise</label>
                <Input
                  placeholder="HEC Paris, Station F..."
                  value={data.school}
                  onChange={(e) => updateData("school", e.target.value)}
                  className="h-12 bg-card border-border focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Votre expertise</h2>
              <p className="text-muted-foreground mt-2">Quel est votre domaine principal ?</p>
            </div>

            <div className="space-y-3">
              {roles.map((r) => (
                <PremiumCard
                  key={r.id}
                  selected={data.role === r.id}
                  onClick={() => updateData("role", r.id)}
                  icon={r.icon}
                  title={r.label}
                  description={r.description}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Owned Skills */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Vos compétences</h2>
              <p className="text-muted-foreground mt-2">
                Sélectionnez jusqu'à 5 compétences ({data.ownedSkillIds.length}/5)
              </p>
            </div>

            {skillsByCategory &&
              Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills?.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        selected={data.ownedSkillIds.includes(skill.id)}
                        disabled={data.ownedSkillIds.length >= 5}
                        onClick={() => {
                          if (data.ownedSkillIds.includes(skill.id)) {
                            updateData(
                              "ownedSkillIds",
                              data.ownedSkillIds.filter((id) => id !== skill.id),
                            );
                          } else if (data.ownedSkillIds.length < 5) {
                            updateData("ownedSkillIds", [...data.ownedSkillIds, skill.id]);
                          }
                        }}
                        label={skill.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Step 4: Wanted Skills */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Profil recherché</h2>
              <p className="text-muted-foreground mt-2">
                Quelles compétences recherchez-vous ? ({data.wantedSkillIds.length}/5)
              </p>
            </div>

            {skillsByCategory &&
              Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills?.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        selected={data.wantedSkillIds.includes(skill.id)}
                        disabled={data.wantedSkillIds.length >= 5}
                        onClick={() => {
                          if (data.wantedSkillIds.includes(skill.id)) {
                            updateData(
                              "wantedSkillIds",
                              data.wantedSkillIds.filter((id) => id !== skill.id),
                            );
                          } else if (data.wantedSkillIds.length < 5) {
                            updateData("wantedSkillIds", [...data.wantedSkillIds, skill.id]);
                          }
                        }}
                        label={skill.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Step 5: Availability & Objective */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Disponibilité & Objectif</h2>
              <p className="text-muted-foreground mt-2">Définissez votre engagement</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Votre disponibilité</h3>
              <div className="space-y-3">
                {availabilities.map((a) => (
                  <PremiumCard
                    key={a.id}
                    selected={data.availability === a.id}
                    onClick={() => updateData("availability", a.id)}
                    icon={a.icon}
                    title={a.label}
                    description={a.description}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Votre objectif</h3>
              <div className="space-y-3">
                {objectives.map((o) => (
                  <PremiumCard
                    key={o.id}
                    selected={data.objective === o.id}
                    onClick={() => updateData("objective", o.id)}
                    icon={o.icon}
                    title={o.label}
                    description={o.description}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Social Links */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Vos réseaux</h2>
              <p className="text-muted-foreground mt-2">Ajoutez vos liens sociaux (optionnel)</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-foreground mb-1.5 block">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="https://linkedin.com/in/votre-profil"
                    value={data.linkedin_url}
                    onChange={(e) => updateData("linkedin_url", e.target.value)}
                    className="h-12 pl-11 bg-card border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-foreground mb-1.5 block">GitHub</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="https://github.com/votre-username"
                    value={data.github_url}
                    onChange={(e) => updateData("github_url", e.target.value)}
                    className="h-12 pl-11 bg-card border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-foreground mb-1.5 block">X (Twitter)</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <Input
                    placeholder="https://x.com/votre-handle"
                    value={data.twitter_url}
                    onChange={(e) => updateData("twitter_url", e.target.value)}
                    className="h-12 pl-11 bg-card border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Ces liens seront visibles sur votre profil public
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="container max-w-xl mx-auto flex justify-between gap-4">
          <Button variant="ghost" onClick={handleBack} className="flex-1 h-12">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || updateProfile.isPending}
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
          >
            {currentStep === 6 ? "Terminer" : "Continuer"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
