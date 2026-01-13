import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Users, Clock, Rocket, CheckCircle } from 'lucide-react';
import { useUpdateProfile, useAllSkills, useUpdateUserSkills, useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const stepLabels = ['Infos', 'Rôle', 'Compétences', 'Recherche', 'Ambition'];

type Role = 'technical' | 'product' | 'business' | 'generalist';
type Objective = 'find-cofounder' | 'join-project';

const roles: { id: Role; label: string; description: string; icon: string }[] = [
  { id: 'technical', label: 'Tech', description: 'Développement, data, infrastructure', icon: '💻' },
  { id: 'product', label: 'Design', description: 'Product management, UX, design', icon: '📱' },
  { id: 'business', label: 'Business', description: 'Vente, stratégie, finance', icon: '💼' },
  { id: 'generalist', label: 'Autre', description: 'Généraliste ou autre domaine', icon: '🔄' },
];

const objectives: { id: Objective; label: string; description: string; icon: string }[] = [
  { id: 'find-cofounder', label: 'Trouver un co-fondateur', description: "J'ai une idée et je cherche quelqu'un", icon: '🎯' },
  { id: 'join-project', label: 'Rejoindre un projet', description: 'Je veux rejoindre une équipe existante', icon: '🤝' },
];

interface OnboardingData {
  full_name: string;
  age: string;
  city: string;
  education: string;
  role_primary: Role | null;
  ownedSkillIds: string[];
  wantedSkillIds: string[];
  commitment_hours: number | null;
  ambition_level: Objective | null;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: allSkills, isLoading: skillsLoading } = useAllSkills();
  const updateProfile = useUpdateProfile();
  const updateSkills = useUpdateUserSkills();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    full_name: '',
    age: '',
    city: '',
    education: '',
    role_primary: null,
    ownedSkillIds: [],
    wantedSkillIds: [],
    commitment_hours: null,
    ambition_level: null,
  });

  // Pre-fill with existing profile data
  useEffect(() => {
    if (profile) {
      setData(prev => ({
        ...prev,
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        city: profile.city || '',
        education: profile.education || '',
        role_primary: profile.role_primary as Role || null,
        commitment_hours: profile.commitment_hours || null,
        ambition_level: profile.ambition_level as Objective || null,
      }));
    }
  }, [profile]);
  
  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.full_name && data.age && data.city && data.education;
      case 2:
        return data.role_primary;
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
      // Save all data to database
      try {
        await updateProfile.mutateAsync({
          full_name: data.full_name,
          age: parseInt(data.age),
          city: data.city,
          education: data.education,
          role_primary: data.role_primary,
          commitment_hours: data.commitment_hours,
          ambition_level: data.ambition_level,
        });

        await updateSkills.mutateAsync({
          ownedSkillIds: data.ownedSkillIds,
          wantedSkillIds: data.wantedSkillIds,
        });

        toast.success('Profil complété avec succès !');
        navigate('/home');
      } catch (error) {
        console.error('Error saving profile:', error);
        toast.error('Erreur lors de la sauvegarde');
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  // Group skills by category
  const skillsByCategory = allSkills?.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof allSkills>);
  
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">CoFounder</span>
          </div>
          <OnboardingProgress 
            currentStep={currentStep} 
            totalSteps={5} 
            stepLabels={stepLabels} 
          />
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <StepPersonalInfo
              fullName={data.full_name}
              age={data.age}
              city={data.city}
              education={data.education}
              onFullNameChange={(v) => updateData('full_name', v)}
              onAgeChange={(v) => updateData('age', v)}
              onCityChange={(v) => updateData('city', v)}
              onEducationChange={(v) => updateData('education', v)}
            />
          )}
          
          {currentStep === 2 && (
            <StepRole
              role={data.role_primary}
              onRoleChange={(role) => updateData('role_primary', role)}
            />
          )}
          
          {currentStep === 3 && (
            <StepSkills
              title="Vos compétences"
              description="Sélectionnez les compétences que vous maîtrisez (jusqu'à 5)"
              selectedSkillIds={data.ownedSkillIds}
              onSkillsChange={(ids) => updateData('ownedSkillIds', ids)}
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
              onSkillsChange={(ids) => updateData('wantedSkillIds', ids)}
              skillsByCategory={skillsByCategory || {}}
              loading={skillsLoading}
              maxSkills={5}
            />
          )}
          
          {currentStep === 5 && (
            <StepEngagement
              commitmentHours={data.commitment_hours}
              ambitionLevel={data.ambition_level}
              onCommitmentHoursChange={(v) => updateData('commitment_hours', v)}
              onAmbitionLevelChange={(v) => updateData('ambition_level', v)}
            />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canProceed() || updateProfile.isPending || updateSkills.isPending}
          >
            {updateProfile.isPending || updateSkills.isPending 
              ? 'Sauvegarde...' 
              : currentStep === 5 
                ? 'Terminer' 
                : 'Continuer'
            }
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

function StepPersonalInfo({ fullName, age, city, education, onFullNameChange, onAgeChange, onCityChange, onEducationChange }: {
  fullName: string;
  age: string;
  city: string;
  education: string;
  onFullNameChange: (v: string) => void;
  onAgeChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onEducationChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Informations personnelles</h2>
        <p className="text-muted-foreground">Quelques infos pour trouver des co-fondateurs proches de vous.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Prénom</label>
          <Input 
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Thomas"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Âge</label>
          <Input 
            type="number"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="25"
            min="18"
            max="99"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ville</label>
          <Input 
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Paris"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">École / Entreprise</label>
          <Input 
            value={education}
            onChange={(e) => onEducationChange(e.target.value)}
            placeholder="HEC, 42, Google..."
          />
          <p className="text-xs text-muted-foreground">
            Votre école actuelle ou votre entreprise
          </p>
        </div>
      </div>
    </div>
  );
}

function StepRole({ role, onRoleChange }: {
  role: Role | null;
  onRoleChange: (role: Role) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Votre rôle idéal</h2>
        <p className="text-muted-foreground">Quel rôle souhaitez-vous occuper dans une startup ?</p>
      </div>
      
      <div className="grid gap-3">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => onRoleChange(r.id)}
            className={cn(
              "p-4 rounded-xl border text-left transition-all duration-200",
              role === r.id 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card border-border hover:border-primary/50 hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{r.icon}</span>
              <div>
                <p className="font-semibold">{r.label}</p>
                <p className={cn(
                  "text-sm",
                  role === r.id ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {r.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSkills({ title, description, selectedSkillIds, onSkillsChange, skillsByCategory, loading, maxSkills }: {
  title: string;
  description: string;
  selectedSkillIds: string[];
  onSkillsChange: (ids: string[]) => void;
  skillsByCategory: Record<string, { id: string; name: string; category: string | null }[]>;
  loading: boolean;
  maxSkills: number;
}) {
  const toggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      onSkillsChange(selectedSkillIds.filter(id => id !== skillId));
    } else if (selectedSkillIds.length < maxSkills) {
      onSkillsChange([...selectedSkillIds, skillId]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
        <p className="text-sm text-primary mt-2">
          {selectedSkillIds.length}/{maxSkills} sélectionnées
        </p>
      </div>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const isSelected = selectedSkillIds.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    disabled={!isSelected && selectedSkillIds.length >= maxSkills}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all duration-200 flex items-center gap-1.5",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80",
                      !isSelected && selectedSkillIds.length >= maxSkills && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepEngagement({ commitmentHours, ambitionLevel, onCommitmentHoursChange, onAmbitionLevelChange }: {
  commitmentHours: number | null;
  ambitionLevel: Objective | null;
  onCommitmentHoursChange: (v: number) => void;
  onAmbitionLevelChange: (v: Objective) => void;
}) {
  // Map availabilities to commitment hours
  const commitmentOptions = [
    { hours: 35, label: 'Temps plein', description: '35h+ par semaine' },
    { hours: 15, label: 'Side project', description: '10-20h par semaine' },
    { hours: 5, label: 'Soirs & weekends', description: 'Moins de 10h par semaine' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Votre engagement</h2>
        <p className="text-muted-foreground">Ces informations aident à trouver quelqu'un avec le même niveau d'investissement.</p>
      </div>
      
      {/* Commitment Hours */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <p className="font-medium text-foreground">Disponibilité</p>
        </div>
        <div className="grid gap-2">
          {commitmentOptions.map((option) => (
            <button
              key={option.hours}
              onClick={() => onCommitmentHoursChange(option.hours)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                commitmentHours === option.hours 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <p className="font-medium">{option.label}</p>
              <p className={cn(
                "text-sm",
                commitmentHours === option.hours ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Objective / Ambition Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-muted-foreground" />
          <p className="font-medium text-foreground">Objectif</p>
        </div>
        <div className="grid gap-2">
          {objectives.map((o) => (
            <button
              key={o.id}
              onClick={() => onAmbitionLevelChange(o.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                ambitionLevel === o.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{o.icon}</span>
                <div>
                  <p className="font-medium">{o.label}</p>
                  <p className={cn(
                    "text-sm",
                    ambitionLevel === o.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {o.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
