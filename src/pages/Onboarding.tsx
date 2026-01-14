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

// Strictement aligné sur tes contraintes SQL Supabase
type Role = "Tech" | "Business" | "Design" | "Marketing" | "Product" | "Operations" | "Other";

const roles: { id: Role; label: string; description: string; icon: string }[] = [
  { id: "Tech", label: "Tech", description: "Développement, data, infrastructure", icon: "💻" },
  { id: "Design", label: "Design", description: "Product management, UX, design", icon: "📱" },
  { id: "Business", label: "Business", description: "Vente, stratégie, finance", icon: "💼" },
  { id: "Other", label: "Autre", description: "Généraliste ou autre domaine", icon: "🔄" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: allSkills, isLoading: skillsLoading } = useAllSkills();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateUserSkills();

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    full_name: "",
    age: "",
    city: "",
    education: "",
    role_primary: null as Role | null,
    ownedSkillIds: [] as string[],
    wantedSkillIds: [] as string[],
    commitment_hours: "35h+",
    ambition_level: "join-project",
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
        commitment_hours: profile.commitment_hours || "35h+",
        ambition_level: profile.ambition_level || "join-project",
      }));
    }
  }, [profile]);

  const updateData = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // --- SÉCURISATION DES DONNÉES (Pour éviter la 400) ---
        const sanitizedUpdates = {
          full_name: data.full_name.trim() || "Utilisateur",
          age: data.age ? parseInt(data.age, 10) : null, // Force l'entier (int4)
          city: data.city.trim() || null,
          education: data.education.trim() || null,
          role_primary: data.role_primary,
          commitment_hours: String(data.commitment_hours), // Force le texte
          ambition_level: String(data.ambition_level), // Force le texte
          onboarding_completed: true,
        };

        // 1. Sauvegarde Profil
        await updateProfile.mutateAsync(sanitizedUpdates);

        // 2. Sauvegarde Skills
        await updateSkills.mutateAsync({
          ownedSkillIds: data.ownedSkillIds,
          wantedSkillIds: data.wantedSkillIds,
        });

        toast.success("Profil enregistré !");
        navigate("/home");
      } catch (error) {
        console.error("Détails de l'erreur:", error);
        toast.error("Erreur de sauvegarde. Vérifiez les champs.");
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!(data.full_name && data.age && data.city);
    if (currentStep === 2) return !!data.role_primary;
    if (currentStep === 3) return data.ownedSkillIds.length > 0;
    if (currentStep === 4) return data.wantedSkillIds.length > 0;
    if (currentStep === 5) return !!(data.commitment_hours && data.ambition_level);
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 container max-w-4xl mx-auto">
        <OnboardingProgress currentStep={currentStep} totalSteps={5} stepLabels={stepLabels} />
      </header>

      <main className="flex-1 container max-w-xl mx-auto py-10 px-4">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Infos Persos</h2>
            <Input
              placeholder="Prénom"
              value={data.full_name}
              onChange={(e) => updateData("full_name", e.target.value)}
            />
            <Input
              placeholder="Âge"
              type="number"
              value={data.age}
              onChange={(e) => updateData("age", e.target.value)}
            />
            <Input placeholder="Ville" value={data.city} onChange={(e) => updateData("city", e.target.value)} />
            <Input
              placeholder="École"
              value={data.education}
              onChange={(e) => updateData("education", e.target.value)}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Votre rôle</h2>
            <div className="grid gap-2">
              {roles.map((r) => (
                <Button
                  key={r.id}
                  variant={data.role_primary === r.id ? "default" : "outline"}
                  onClick={() => updateData("role_primary", r.id)}
                >
                  {r.icon} {r.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <SkillsStep
            title="Vos compétences"
            selected={data.ownedSkillIds}
            onChange={(ids) => updateData("ownedSkillIds", ids)}
            allSkills={allSkills}
          />
        )}
        {currentStep === 4 && (
          <SkillsStep
            title="Recherche"
            selected={data.wantedSkillIds}
            onChange={(ids) => updateData("wantedSkillIds", ids)}
            allSkills={allSkills}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Engagement</h2>
            <div className="grid gap-2">
              {["35h+", "15h", "5h"].map((v) => (
                <Button
                  key={v}
                  variant={data.commitment_hours === v ? "default" : "outline"}
                  onClick={() => updateData("commitment_hours", v)}
                >
                  {v}
                </Button>
              ))}
            </div>
            <div className="grid gap-2">
              {["find-cofounder", "join-project"].map((v) => (
                <Button
                  key={v}
                  variant={data.ambition_level === v ? "default" : "outline"}
                  onClick={() => updateData("ambition_level", v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 border-t container max-w-xl mx-auto flex justify-between">
        <Button variant="ghost" onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate("/"))}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!canProceed() || updateProfile.isPending}>
          {currentStep === 5 ? "Terminer" : "Continuer"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}

function SkillsStep({ title, selected, onChange, allSkills }: any) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((s: string) => s !== id));
    else if (selected.length < 5) onChange([...selected, id]);
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {allSkills?.map((s: any) => (
          <Button
            key={s.id}
            variant={selected.includes(s.id) ? "default" : "secondary"}
            onClick={() => toggle(s.id)}
            className="rounded-full"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
