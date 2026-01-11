import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { SkillSelector } from '@/components/SkillSelector';
import { WantedSkillSelector } from '@/components/WantedSkillSelector';
import { UserSkill, WantedSkill, Role, Availability, Ambition, OnboardingData } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Users, Clock, Rocket } from 'lucide-react';

const stepLabels = ['Infos', 'Rôle', 'Compétences', 'Recherche', 'Ambition'];

const roles: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'technical', label: 'Tech', description: 'Développement, data, infrastructure', icon: '💻' },
  { id: 'product', label: 'Design', description: 'Product management, UX, design', icon: '📱' },
  { id: 'business', label: 'Business', description: 'Vente, stratégie, finance', icon: '💼' },
  { id: 'generalist', label: 'Autre', description: 'Généraliste ou autre domaine', icon: '🔄' },
];

const availabilities: { id: Availability; label: string; description: string }[] = [
  { id: 'full-time', label: 'Temps plein', description: '35h+ par semaine' },
  { id: 'part-time', label: 'Side project', description: '10-20h par semaine' },
  { id: 'evenings-weekends', label: 'Soirs & weekends', description: 'Moins de 10h par semaine' },
];

const ambitions: { id: Ambition; label: string; description: string; icon: string }[] = [
  { id: 'lifestyle', label: 'Side project', description: 'Projet passion, revenus complémentaires', icon: '🌴' },
  { id: 'growth', label: 'Scale-up', description: 'Croissance, potentielle levée de fonds', icon: '📈' },
  { id: 'unicorn', label: 'Full-time', description: 'Je veux en faire mon métier', icon: '🚀' },
];

interface OnboardingExtendedData extends OnboardingData {
  age: string;
  city: string;
  school: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingExtendedData>>({
    firstName: '',
    lastName: '',
    bio: '',
    age: '',
    city: '',
    school: '',
    primarySkills: [],
    secondarySkills: [],
    wantedSkills: [],
    role: undefined,
    availability: undefined,
    ambition: undefined,
  });
  
  const updateData = <K extends keyof OnboardingExtendedData>(key: K, value: OnboardingExtendedData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Personal info - age, city, school
        return data.age && data.city && data.school;
      case 2:
        // Step 2: Role
        return data.role;
      case 3:
        // Step 3: Skills I have
        return data.primarySkills && data.primarySkills.length >= 1;
      case 4:
        // Step 4: Skills I'm looking for
        return data.wantedSkills && data.wantedSkills.length >= 1;
      case 5:
        // Step 5: Ambition & pace
        return data.availability && data.ambition;
      default:
        return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - go to home (swipe)
      navigate('/home');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };
  
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
              age={data.age || ''}
              city={data.city || ''}
              school={data.school || ''}
              onAgeChange={(v) => updateData('age', v)}
              onCityChange={(v) => updateData('city', v)}
              onSchoolChange={(v) => updateData('school', v)}
            />
          )}
          
          {currentStep === 2 && (
            <StepRole
              role={data.role}
              onRoleChange={(role) => updateData('role', role)}
            />
          )}
          
          {currentStep === 3 && (
            <StepSkills
              primarySkills={data.primarySkills || []}
              secondarySkills={data.secondarySkills || []}
              onPrimarySkillsChange={(skills) => updateData('primarySkills', skills)}
              onSecondarySkillsChange={(skills) => updateData('secondarySkills', skills)}
            />
          )}
          
          {currentStep === 4 && (
            <StepWantedSkills
              wantedSkills={data.wantedSkills || []}
              onWantedSkillsChange={(skills) => updateData('wantedSkills', skills as WantedSkill[])}
            />
          )}
          
          {currentStep === 5 && (
            <StepEngagement
              availability={data.availability}
              ambition={data.ambition}
              onAvailabilityChange={(v) => updateData('availability', v)}
              onAmbitionChange={(v) => updateData('ambition', v)}
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
            variant="accent" 
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === 5 ? 'Terminer' : 'Continuer'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

function StepPersonalInfo({ age, city, school, onAgeChange, onCityChange, onSchoolChange }: {
  age: string;
  city: string;
  school: string;
  onAgeChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onSchoolChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Informations personnelles</h2>
        <p className="text-muted-foreground">Quelques infos pour trouver des co-fondateurs proches de vous.</p>
      </div>
      
      <div className="space-y-4">
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
            value={school}
            onChange={(e) => onSchoolChange(e.target.value)}
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

function StepSkills({ primarySkills, secondarySkills, onPrimarySkillsChange, onSecondarySkillsChange }: {
  primarySkills: UserSkill[];
  secondarySkills: UserSkill[];
  onPrimarySkillsChange: (skills: UserSkill[]) => void;
  onSecondarySkillsChange: (skills: UserSkill[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Vos compétences</h2>
        <p className="text-muted-foreground">
          Sélectionnez jusqu'à <strong>5 compétences principales</strong> et <strong>5 secondaires</strong>.
        </p>
      </div>
      
      <SkillSelector
        primarySkills={primarySkills}
        secondarySkills={secondarySkills}
        onPrimarySkillsChange={onPrimarySkillsChange}
        onSecondarySkillsChange={onSecondarySkillsChange}
        maxPrimary={5}
        maxSecondary={5}
      />
    </div>
  );
}

function StepWantedSkills({ wantedSkills, onWantedSkillsChange }: {
  wantedSkills: WantedSkill[];
  onWantedSkillsChange: (skills: WantedSkill[]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Ce que vous recherchez</h2>
        <p className="text-muted-foreground">
          Quelles compétences recherchez-vous chez un co-fondateur ? (jusqu'à 5)
        </p>
      </div>
      
      <WantedSkillSelector
        selectedSkills={wantedSkills}
        onSkillsChange={onWantedSkillsChange}
        maxSkills={5}
      />
    </div>
  );
}

function StepRole({ role, onRoleChange }: {
  role?: Role;
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

function StepEngagement({ availability, ambition, onAvailabilityChange, onAmbitionChange }: {
  availability?: Availability;
  ambition?: Ambition;
  onAvailabilityChange: (v: Availability) => void;
  onAmbitionChange: (v: Ambition) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Votre engagement</h2>
        <p className="text-muted-foreground">Ces informations aident à trouver quelqu'un avec le même niveau d'investissement.</p>
      </div>
      
      {/* Availability */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <p className="font-medium text-foreground">Disponibilité</p>
        </div>
        <div className="grid gap-2">
          {availabilities.map((a) => (
            <button
              key={a.id}
              onClick={() => onAvailabilityChange(a.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                availability === a.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <p className="font-medium">{a.label}</p>
              <p className={cn(
                "text-sm",
                availability === a.id ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {a.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Ambition */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-muted-foreground" />
          <p className="font-medium text-foreground">Ambition</p>
        </div>
        <div className="grid gap-2">
          {ambitions.map((a) => (
            <button
              key={a.id}
              onClick={() => onAmbitionChange(a.id)}
              className={cn(
                "p-3 rounded-lg border text-left transition-all duration-200",
                ambition === a.id 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span>{a.icon}</span>
                <div>
                  <p className="font-medium">{a.label}</p>
                  <p className={cn(
                    "text-sm",
                    ambition === a.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {a.description}
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
