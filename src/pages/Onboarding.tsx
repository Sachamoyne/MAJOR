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

const stepLabels = ['Profil', 'Compétences', 'Recherche', 'Rôle', 'Engagement'];

const roles: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'technical', label: 'Technique', description: 'Développement, data, infrastructure', icon: '💻' },
  { id: 'product', label: 'Produit', description: 'Product management, UX, design', icon: '📱' },
  { id: 'business', label: 'Business', description: 'Vente, stratégie, finance', icon: '💼' },
  { id: 'marketing', label: 'Marketing', description: 'Growth, acquisition, branding', icon: '📣' },
  { id: 'generalist', label: 'Généraliste', description: 'Un peu de tout, flexible', icon: '🔄' },
];

const availabilities: { id: Availability; label: string; description: string }[] = [
  { id: 'full-time', label: 'Temps plein', description: '35h+ par semaine' },
  { id: 'part-time', label: 'Temps partiel', description: '15-35h par semaine' },
  { id: 'evenings-weekends', label: 'Soirs & weekends', description: 'Moins de 15h par semaine' },
];

const ambitions: { id: Ambition; label: string; description: string; icon: string }[] = [
  { id: 'lifestyle', label: 'Lifestyle business', description: 'Indépendance, qualité de vie', icon: '🌴' },
  { id: 'growth', label: 'Croissance', description: 'Scale-up, levée de fonds possible', icon: '📈' },
  { id: 'unicorn', label: 'Licorne', description: 'Go big or go home', icon: '🦄' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    firstName: '',
    lastName: '',
    bio: '',
    primarySkills: [],
    secondarySkills: [],
    wantedSkills: [],
    role: undefined,
    availability: undefined,
    ambition: undefined,
  });
  
  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.firstName && data.lastName && data.bio && data.bio.length >= 20;
      case 2:
        // Au moins 1 compétence principale requise
        return data.primarySkills && data.primarySkills.length >= 1;
      case 3:
        return data.wantedSkills && data.wantedSkills.length >= 1;
      case 4:
        return data.role;
      case 5:
        return data.availability && data.ambition;
      default:
        return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/discover');
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
            <StepProfile
              firstName={data.firstName || ''}
              lastName={data.lastName || ''}
              bio={data.bio || ''}
              onFirstNameChange={(v) => updateData('firstName', v)}
              onLastNameChange={(v) => updateData('lastName', v)}
              onBioChange={(v) => updateData('bio', v)}
            />
          )}
          
          {currentStep === 2 && (
            <StepSkills
              primarySkills={data.primarySkills || []}
              secondarySkills={data.secondarySkills || []}
              onPrimarySkillsChange={(skills) => updateData('primarySkills', skills)}
              onSecondarySkillsChange={(skills) => updateData('secondarySkills', skills)}
            />
          )}
          
          {currentStep === 3 && (
            <StepWantedSkills
              wantedSkills={data.wantedSkills || []}
              onWantedSkillsChange={(skills) => updateData('wantedSkills', skills as WantedSkill[])}
            />
          )}
          
          {currentStep === 4 && (
            <StepRole
              role={data.role}
              onRoleChange={(role) => updateData('role', role)}
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

function StepProfile({ firstName, lastName, bio, onFirstNameChange, onLastNameChange, onBioChange }: {
  firstName: string;
  lastName: string;
  bio: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onBioChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Présentez-vous</h2>
        <p className="text-muted-foreground">Ces informations seront visibles par vos futurs co-fondateurs.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Prénom</label>
          <Input 
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Votre prénom"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nom</label>
          <Input 
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Votre nom"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Bio</label>
        <Textarea 
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Parlez de votre parcours, votre expérience et ce qui vous motive à entreprendre..."
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {bio.length}/500 caractères (minimum 20)
        </p>
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
