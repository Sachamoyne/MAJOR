import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Users, Clock, Rocket, CheckCircle } from "lucide-react";
import { useUpdateProfile, useAllSkills, useUpdateUserSkills, useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const stepLabels = ["Infos", "Rôle", "Compétences", "Recherche", "Ambition"];

// Alignement sur les Enums SQL de ta base
type Role = "Tech" | "Business" | "Design" | "Marketing" | "Product" | "Operations" | "Other";
type Objective = "find-cofounder" | "join-project";

const roles: { id: Role; label: string; description: string; icon: string }[] = [
  { id: "Tech", label: "Tech", description: "Développement, data, infrastructure", icon: "💻" },
  { id: "Design", label: "Design", description: "Product management, UX, design", icon: "📱" },
  { id: "Business", label: "Business", description: "Vente, stratégie, finance", icon: "💼" },
  { id: "Other", label: "Autre", description: "Généraliste ou autre domaine", icon: "🔄" },
];

const objectives: { id: Objective; label: string; description: string; icon: string }[] = [
  {
    id: "find-cofounder",
    label: "Trouver un co-fondateur",
    description: "J'ai une idée et je cherche quelqu'un",
    icon: "🎯",
  },
  {
    id: "join-project",
    label: "Rejoindre un projet",
    description: "Je veux rejoindre une équipe existante",
    icon: "🤝",
  },
];

interface OnboardingData {
  full_name: string;
  age: string;
  city: string;
  education: string;
  role_primary: Role | null;
  ownedSkillIds: string[];
  wantedSkillIds: string[];
  commitment_hours: string | null; // Changé en string pour match Supabase
  ambition_level: string | null;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: allSkills, isLoading: skillsLoading } = useAllSkills();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateUserSkills();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    full_name: "",
    age: "",
    city: "",
    education: "",
    role_primary: null,
    ownedSkillIds: [],
    wantedSkillIds: [],
    commitment_hours: null,
    ambition_level: null,
  });

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        full_name: profile.full_name || "",
        age: profile.age?.toString() || "",
        city: profile.city || "",
        education: profile.education || "",
        role_primary: (profile.role_primary as Role) || null,
        commitment_hours: profile.commitment_hours || null,
        ambition_level: profile.ambition_level || null,
      }));
    }
  }, [profile]);

  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.full_name && data.age && data.city && data.education;
      case 2:
        return !!data.role_primary;
      case 3:
        return data.ownedSkillIds.length >= 1;
      case 4:
        return data.wantedSkillIds.length >= 1;
      case 5:
        return data.commitment_hours && data.ambition_level;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Envoi des données avec les bons types
        await updateProfile.mutateAsync({
          full_name: data.full_name,
          age: parseInt(data.age),
          city: data.city,
          education: data.education,
          role_primary: data.role_primary,
          commitment_hours: data.commitment_hours,
          ambition_level: data.ambition_level,
          onboarding_completed: true,
        });

        await updateSkills.mutateAsync({
          ownedSkillIds: data.ownedSkillIds,
          wantedSkillIds: data.wantedSkillIds,
        });

        toast.success("Profil complété avec succès !");
        navigate("/home");
      } catch (error) {
        console.error("Error saving profile:", error);
        toast.error("Erreur lors de la sauvegarde : vérifiez les types de données");
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

  const skillsByCategory = allSkills?.reduce(
    (acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, typeof allSkills>,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">CoFounder</span>
          </div>
          <OnboardingProgress currentStep={currentStep} totalSteps={5} stepLabels={stepLabels} />
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <StepPersonalInfo
              fullName={data.full_name}
              age={data.age}
              city={data.city}
              education={data.education}
              onFullNameChange={(v) => updateData("full_name", v)}
              onAgeChange={(v) => updateData("age", v)}
              onCityChange={(v) => updateData("city", v)}
              onEducationChange={(v) => updateData("education", v)}
            />
          )}

          {currentStep === 2 && (
            <StepRole role={data.role_primary} onRoleChange={(role) => updateData("role_primary", role)} />
          )}

          {currentStep === 3 && (
            <StepSkills
              title="Vos compétences"
              description="Sélectionnez les compétences que vous maîtrisez (jusqu'à 5)"
              selectedSkillIds={data.ownedSkillIds}
              onSkillsChange={(ids) => updateData("ownedSkillIds", ids)}
              skillsByCategory={skillsByCategory || {}}
              loading={skillsLoading}
              maxSkills={5}
            />
          )}

          {currentStep === 4 && (
            <StepSkills
              title="Ce que vous recherchez"
              description="Quelles compétences recherchez-vous chez un co-fondateur ? (jusqu'à 5)"
              selectedSkillIds={data.wantedSkillIds}
              onSkillsChange={(ids) => updateData("wantedSkillIds", ids)}
              skillsByCategory={skillsByCategory || {}}
              loading={skillsLoading}
              maxSkills={5}
            />
          )}

          {currentStep === 5 && (
            <StepEngagement
              commitmentHours={data.commitment_hours}
              ambitionLevel={data.ambition_level as Objective | null}
              onCommitmentHoursChange={(v) => updateData("commitment_hours", v)}
              onAmbitionLevelChange={(v) => updateData("ambition_level", v)}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || updateProfile.isPending || updateSkills.isPending}>
            {updateProfile.isPending || updateSkills.isPending
              ? "Sauvegarde..."
              : currentStep === 5
                ? "Terminer"
                : "Continuer"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

// Composants de step inchangés mais avec types cleans
function StepPersonalInfo({
  fullName,
  age,
  city,
  education,
  onFullNameChange,
  onAgeChange,
  onCityChange,
  onEducationChange,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Informations personnelles</h2>
        <p className="text-muted-foreground">Quelques infos pour trouver des co-fondateurs proches de vous.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prénom</label>
          <Input value={fullName} onChange={(e) => onFullNameChange(e.target.value)} placeholder="Thomas" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Âge</label>
          <Input type="number" value={age} onChange={(e) => onAgeChange(e.target.value)} placeholder="25" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ville</label>
          <Input value={city} onChange={(e) => onCityChange(e.target.value)} placeholder="Paris" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">École / Entreprise</label>
          <Input
            value={education}
            onChange={(e) => onEducationChange(e.target.value)}
            placeholder="HEC, 42, Google..."
          />
        </div>
      </div>
    </div>
  );
}

function StepRole({ role, onRoleChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Votre rôle idéal</h2>
      <div className="grid gap-3">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => onRoleChange(r.id)}
            className={cn(
              "p-4 rounded-xl border text-left",
              role === r.id ? "bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            <span className="text-2xl mr-2">{r.icon}</span> {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSkills({
  title,
  description,
  selectedSkillIds,
  onSkillsChange,
  skillsByCategory,
  loading,
  maxSkills,
}: any) {
  const toggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      onSkillsChange(selectedSkillIds.filter((id: string) => id !== skillId));
    } else if (selectedSkillIds.length < maxSkills) {
      onSkillsChange([...selectedSkillIds, skillId]);
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="space-y-4">
        {Object.entries(skillsByCategory).map(([category, skills]: any) => (
          <div key={category}>
            <p className="text-sm text-muted-foreground">{category}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s: any) => (
                <Button
                  key={s.id}
                  variant={selectedSkillIds.includes(s.id) ? "default" : "secondary"}
                  onClick={() => toggleSkill(s.id)}
                >
                  {s.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepEngagement({ commitmentHours, ambitionLevel, onCommitmentHoursChange, onAmbitionLevelChange }: any) {
  const options = [
    { value: "35h+", label: "Temps plein" },
    { value: "15h", label: "Side project" },
    { value: "5h", label: "Soirs & weekends" },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Votre engagement</h2>
      <div className="grid gap-3">
        {options.map((o) => (
          <Button
            key={o.value}
            variant={commitmentHours === o.value ? "default" : "outline"}
            onClick={() => onCommitmentHoursChange(o.value)}
          >
            {o.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-3">
        {objectives.map((o) => (
          <Button
            key={o.id}
            variant={ambitionLevel === o.id ? "default" : "outline"}
            onClick={() => onAmbitionLevelChange(o.id)}
          >
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
