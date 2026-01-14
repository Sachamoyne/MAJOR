import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ArrowRight } from "lucide-react";
import { useUpdateProfile, useAllSkills, useUpdateUserSkills, useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const stepLabels = ["Infos", "Rôle", "Compétences", "Recherche", "Objectif"];

type Role = "Tech" | "Business" | "Design" | "Marketing" | "Product" | "Operations" | "Other";

const roles: { id: Role; label: string; description: string; icon: string }[] = [
  { id: "Tech", label: "Tech", description: "Développement, data, infrastructure", icon: "💻" },
  { id: "Design", label: "Design", description: "Product management, UX, design", icon: "📱" },
  { id: "Business", label: "Business", description: "Vente, stratégie, finance", icon: "💼" },
  { id: "Other", label: "Autre", description: "Généraliste ou autre domaine", icon: "🔄" },
];

const availabilities = [
  { id: "full-time", label: "Temps plein", description: "35h+ par semaine" },
  { id: "part-time", label: "Mi-temps", description: "15-20h par semaine" },
  { id: "evenings-weekends", label: "Soirs & weekends", description: "5-10h par semaine" },
];

const objectives = [
  { id: "find-cofounder", label: "Trouver un co-fondateur", description: "Je cherche mon associé(e)" },
  { id: "join-project", label: "Rejoindre un projet", description: "Je veux intégrer une équipe" },
];

export default function Onboarding() {
  const navigate = useNavigate();
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
    role: null as Role | null,
    ownedSkillIds: [] as string[],
    wantedSkillIds: [] as string[],
    availability: "full-time",
    objective: "find-cofounder",
  });

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        name: profile.name || "",
        age: profile.age?.toString() || "",
        city: profile.city || "",
        school: profile.school || "",
        role: (profile.role as Role) || null,
        availability: profile.availability || "full-time",
        objective: profile.objective || "find-cofounder",
      }));
    }
  }, [profile]);

  const updateData = (key: string, value: string | string[] | Role | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Save profile
        await updateProfile.mutateAsync({
          name: data.name.trim() || null,
          age: data.age ? parseInt(data.age, 10) : null,
          city: data.city.trim() || null,
          school: data.school.trim() || null,
          role: data.role,
          availability: data.availability,
          objective: data.objective,
        });

        // Save skills
        await updateSkills.mutateAsync({
          ownedSkillIds: data.ownedSkillIds,
          wantedSkillIds: data.wantedSkillIds,
        });

        toast.success("Profil enregistré !");
        navigate("/home");
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur de sauvegarde.");
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!(data.name && data.age && data.city);
    if (currentStep === 2) return !!data.role;
    if (currentStep === 3) return data.ownedSkillIds.length > 0;
    if (currentStep === 4) return data.wantedSkillIds.length > 0;
    if (currentStep === 5) return !!(data.availability && data.objective);
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
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
            />
            <Input
              placeholder="Âge"
              type="number"
              value={data.age}
              onChange={(e) => updateData("age", e.target.value)}
            />
            <Input placeholder="Ville" value={data.city} onChange={(e) => updateData("city", e.target.value)} />
            <Input
              placeholder="École / Entreprise"
              value={data.school}
              onChange={(e) => updateData("school", e.target.value)}
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
                  variant={data.role === r.id ? "default" : "outline"}
                  onClick={() => updateData("role", r.id)}
                  className="justify-start"
                >
                  {r.icon} {r.label} - {r.description}
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
            title="Ce que vous recherchez"
            selected={data.wantedSkillIds}
            onChange={(ids) => updateData("wantedSkillIds", ids)}
            allSkills={allSkills}
          />
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Disponibilité & Objectif</h2>
            <div className="space-y-2">
              <h3 className="font-medium">Votre disponibilité</h3>
              <div className="grid gap-2">
                {availabilities.map((a) => (
                  <Button
                    key={a.id}
                    variant={data.availability === a.id ? "default" : "outline"}
                    onClick={() => updateData("availability", a.id)}
                    className="justify-start"
                  >
                    {a.label} - {a.description}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Votre objectif</h3>
              <div className="grid gap-2">
                {objectives.map((o) => (
                  <Button
                    key={o.id}
                    variant={data.objective === o.id ? "default" : "outline"}
                    onClick={() => updateData("objective", o.id)}
                    className="justify-start"
                  >
                    {o.label} - {o.description}
                  </Button>
                ))}
              </div>
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

function SkillsStep({ title, selected, onChange, allSkills }: {
  title: string;
  selected: string[];
  onChange: (ids: string[]) => void;
  allSkills: { id: string; name: string; category: string | null }[] | undefined;
}) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else if (selected.length < 5) onChange([...selected, id]);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground">Sélectionnez jusqu'à 5 compétences</p>
      <div className="flex flex-wrap gap-2">
        {allSkills?.map((s) => (
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
