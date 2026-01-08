import { useState } from 'react';
import { Skill, SkillCategory, SkillLevel, UserSkill } from '@/types';
import { skills, skillCategories, getSkillsByCategory } from '@/data/skills';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X, Star, Sparkles } from 'lucide-react';

interface SkillSelectorProps {
  primarySkills: UserSkill[];
  secondarySkills: UserSkill[];
  onPrimarySkillsChange: (skills: UserSkill[]) => void;
  onSecondarySkillsChange: (skills: UserSkill[]) => void;
  maxPrimary?: number;
  maxSecondary?: number;
}

const levelConfig: { id: SkillLevel; label: string; description: string }[] = [
  { id: 'beginner', label: 'Débutant', description: 'Notions de base' },
  { id: 'intermediate', label: 'Opérationnel', description: 'Autonome sur les tâches courantes' },
  { id: 'expert', label: 'Expert', description: 'Maîtrise avancée' },
];

type SkillMode = 'primary' | 'secondary';

export function SkillSelector({ 
  primarySkills, 
  secondarySkills, 
  onPrimarySkillsChange, 
  onSecondarySkillsChange,
  maxPrimary = 5,
  maxSecondary = 5 
}: SkillSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('tech-product');
  const [pendingSkill, setPendingSkill] = useState<{ skill: Skill; mode: SkillMode } | null>(null);
  
  const categorySkills = getSkillsByCategory(activeCategory);
  const allSelectedSkills = [...primarySkills, ...secondarySkills];
  
  const isSkillSelected = (skillId: string) => {
    return allSelectedSkills.some(s => s.skill.id === skillId);
  };
  
  const getSkillType = (skillId: string): SkillMode | null => {
    if (primarySkills.some(s => s.skill.id === skillId)) return 'primary';
    if (secondarySkills.some(s => s.skill.id === skillId)) return 'secondary';
    return null;
  };
  
  const handleSkillClick = (skill: Skill) => {
    const type = getSkillType(skill.id);
    
    if (type === 'primary') {
      onPrimarySkillsChange(primarySkills.filter(s => s.skill.id !== skill.id));
    } else if (type === 'secondary') {
      onSecondarySkillsChange(secondarySkills.filter(s => s.skill.id !== skill.id));
    } else {
      // Show mode selector (primary vs secondary)
      setPendingSkill({ skill, mode: 'primary' });
    }
  };
  
  const handleModeSelect = (mode: SkillMode) => {
    if (!pendingSkill) return;
    
    const canAddPrimary = primarySkills.length < maxPrimary;
    const canAddSecondary = secondarySkills.length < maxSecondary;
    
    if (mode === 'primary' && !canAddPrimary) return;
    if (mode === 'secondary' && !canAddSecondary) return;
    
    setPendingSkill({ ...pendingSkill, mode });
  };
  
  const handleLevelSelect = (level: SkillLevel) => {
    if (!pendingSkill) return;
    
    const newSkill: UserSkill = {
      skill: pendingSkill.skill,
      level,
    };
    
    if (pendingSkill.mode === 'primary') {
      onPrimarySkillsChange([...primarySkills, newSkill]);
    } else {
      onSecondarySkillsChange([...secondarySkills, newSkill]);
    }
    
    setPendingSkill(null);
  };
  
  const canAddPrimary = primarySkills.length < maxPrimary;
  const canAddSecondary = secondarySkills.length < maxSecondary;
  
  return (
    <div className="space-y-6">
      {/* Summary badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "p-3 rounded-xl border-2 transition-all",
          primarySkills.length > 0 ? "border-primary bg-primary/5" : "border-border bg-card"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Principales</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {primarySkills.length}/{maxPrimary} sélectionnées
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-xl border-2 transition-all",
          secondarySkills.length > 0 ? "border-accent bg-accent/5" : "border-border bg-card"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Secondaires</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {secondarySkills.length}/{maxSecondary} sélectionnées
          </p>
        </div>
      </div>

      {/* Selected skills display */}
      {(primarySkills.length > 0 || secondarySkills.length > 0) && (
        <div className="space-y-3">
          {primarySkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {primarySkills.map((item) => (
                <Badge 
                  key={item.skill.id}
                  variant="skill"
                  className="py-1.5 px-3 text-sm cursor-pointer hover:opacity-80 transition-opacity group"
                  onClick={() => handleSkillClick(item.skill)}
                >
                  <Star className="w-3 h-3 mr-1.5" />
                  {item.skill.name}
                  <span className="mx-1.5 opacity-50">·</span>
                  <span className="opacity-70">{levelConfig.find(l => l.id === item.level)?.label}</span>
                  <X className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
          )}
          {secondarySkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {secondarySkills.map((item) => (
                <Badge 
                  key={item.skill.id}
                  variant="skill-wanted"
                  className="py-1.5 px-3 text-sm cursor-pointer hover:opacity-80 transition-opacity group"
                  onClick={() => handleSkillClick(item.skill)}
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  {item.skill.name}
                  <span className="mx-1.5 opacity-50">·</span>
                  <span className="opacity-70">{levelConfig.find(l => l.id === item.level)?.label}</span>
                  <X className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Pending skill selector */}
      {pendingSkill && (
        <div className="p-4 rounded-xl bg-card border-2 border-primary/30 animate-scale-in space-y-4">
          <p className="text-sm font-semibold text-foreground">
            « {pendingSkill.skill.name} »
          </p>
          
          {/* Mode selection */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Type de compétence</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleModeSelect('primary')}
                disabled={!canAddPrimary}
                className={cn(
                  "flex-1 p-2 rounded-lg border-2 text-sm font-medium transition-all",
                  pendingSkill.mode === 'primary' 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border hover:border-primary/50",
                  !canAddPrimary && "opacity-50 cursor-not-allowed"
                )}
              >
                <Star className="w-4 h-4 mx-auto mb-1" />
                Principale
              </button>
              <button
                onClick={() => handleModeSelect('secondary')}
                disabled={!canAddSecondary}
                className={cn(
                  "flex-1 p-2 rounded-lg border-2 text-sm font-medium transition-all",
                  pendingSkill.mode === 'secondary' 
                    ? "border-accent bg-accent/10 text-accent" 
                    : "border-border hover:border-accent/50",
                  !canAddSecondary && "opacity-50 cursor-not-allowed"
                )}
              >
                <Sparkles className="w-4 h-4 mx-auto mb-1" />
                Secondaire
              </button>
            </div>
          </div>
          
          {/* Level selection */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Votre niveau</p>
            <div className="grid gap-2">
              {levelConfig.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-secondary",
                    "bg-card border-border"
                  )}
                >
                  <p className="font-medium text-sm text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setPendingSkill(null)}
          >
            Annuler
          </Button>
        </div>
      )}
      
      {/* Category tabs */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Catégories</p>
        <div className="flex flex-wrap gap-2">
          {skillCategories.map((category) => {
            const categoryCount = allSelectedSkills.filter(
              s => s.skill.category === category.id
            ).length;
            
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="relative"
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.label}
                {categoryCount > 0 && (
                  <span className="ml-1.5 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                    {categoryCount}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categorySkills.map((skill) => {
          const skillType = getSkillType(skill.id);
          const isSelected = skillType !== null;
          const isDisabled = !isSelected && !canAddPrimary && !canAddSecondary;
          
          return (
            <button
              key={skill.id}
              onClick={() => !isDisabled && handleSkillClick(skill)}
              disabled={isDisabled}
              className={cn(
                "p-3 rounded-xl border-2 text-left text-sm transition-all duration-200",
                skillType === 'primary' && "bg-primary/10 text-primary border-primary",
                skillType === 'secondary' && "bg-accent/10 text-accent border-accent",
                !isSelected && !isDisabled && "bg-card hover:bg-secondary border-border hover:border-primary/50",
                isDisabled && "opacity-40 cursor-not-allowed bg-muted border-muted"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "font-medium",
                  !isSelected && "text-foreground"
                )}>{skill.name}</span>
                {skillType === 'primary' && <Star className="w-4 h-4" />}
                {skillType === 'secondary' && <Sparkles className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        💡 Les compétences principales définissent votre profil. Les secondaires complètent votre expertise.
      </p>
    </div>
  );
}
