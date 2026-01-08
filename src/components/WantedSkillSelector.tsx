import { useState } from 'react';
import { Skill, SkillCategory, Priority, WantedSkill } from '@/types';
import { skillCategories, getSkillsByCategory } from '@/data/skills';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Zap, Sparkles } from 'lucide-react';

interface WantedSkillSelectorProps {
  selectedSkills: WantedSkill[];
  onSkillsChange: (skills: WantedSkill[]) => void;
  maxSkills?: number;
}

const priorityConfig: { id: Priority; label: string; description: string; icon: React.ReactNode }[] = [
  { id: 'must-have', label: 'Indispensable', description: 'Critère bloquant pour le matching', icon: <Zap className="w-4 h-4" /> },
  { id: 'nice-to-have', label: 'Bonus', description: 'Un plus, mais pas obligatoire', icon: <Sparkles className="w-4 h-4" /> },
];

export function WantedSkillSelector({ 
  selectedSkills, 
  onSkillsChange,
  maxSkills = 5 
}: WantedSkillSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('tech-product');
  const [pendingSkill, setPendingSkill] = useState<Skill | null>(null);
  
  const categorySkills = getSkillsByCategory(activeCategory);
  
  const isSkillSelected = (skillId: string) => {
    return selectedSkills.some(s => s.skill.id === skillId);
  };
  
  const getSkillPriority = (skillId: string): Priority | null => {
    const skill = selectedSkills.find(s => s.skill.id === skillId);
    return skill?.priority || null;
  };
  
  const handleSkillClick = (skill: Skill) => {
    if (isSkillSelected(skill.id)) {
      onSkillsChange(selectedSkills.filter(s => s.skill.id !== skill.id));
    } else if (selectedSkills.length < maxSkills) {
      setPendingSkill(skill);
    }
  };
  
  const handlePrioritySelect = (priority: Priority) => {
    if (!pendingSkill) return;
    
    const newSkill: WantedSkill = {
      skill: pendingSkill,
      priority,
    };
    
    onSkillsChange([...selectedSkills, newSkill]);
    setPendingSkill(null);
  };
  
  const mustHaveCount = selectedSkills.filter(s => s.priority === 'must-have').length;
  const niceToHaveCount = selectedSkills.filter(s => s.priority === 'nice-to-have').length;
  
  return (
    <div className="space-y-6">
      {/* Summary badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "p-3 rounded-xl border-2 transition-all",
          mustHaveCount > 0 ? "border-accent bg-accent/5" : "border-border bg-card"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Indispensables</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {mustHaveCount} sélectionnée{mustHaveCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className={cn(
          "p-3 rounded-xl border-2 transition-all",
          niceToHaveCount > 0 ? "border-primary/50 bg-primary/5" : "border-border bg-card"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Bonus</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {niceToHaveCount} sélectionnée{niceToHaveCount > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Selected skills display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((item) => (
            <Badge 
              key={item.skill.id}
              variant={item.priority === 'must-have' ? 'excellent' : 'good'}
              className="py-1.5 px-3 text-sm cursor-pointer hover:opacity-80 transition-opacity group"
              onClick={() => handleSkillClick(item.skill)}
            >
              {item.priority === 'must-have' ? <Zap className="w-3 h-3 mr-1.5" /> : <Sparkles className="w-3 h-3 mr-1.5" />}
              {item.skill.name}
              <X className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Badge>
          ))}
        </div>
      )}
      
      {/* Pending skill selector */}
      {pendingSkill && (
        <div className="p-4 rounded-xl bg-card border-2 border-accent/30 animate-scale-in space-y-4">
          <p className="text-sm font-semibold text-foreground">
            « {pendingSkill.name} »
          </p>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quelle importance ?</p>
            <div className="grid gap-2">
              {priorityConfig.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => handlePrioritySelect(priority.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all hover:border-accent/50 hover:bg-secondary",
                    "bg-card border-border"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {priority.icon}
                    <div>
                      <p className="font-medium text-sm text-foreground">{priority.label}</p>
                      <p className="text-xs text-muted-foreground">{priority.description}</p>
                    </div>
                  </div>
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
            const categoryCount = selectedSkills.filter(
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
          const priority = getSkillPriority(skill.id);
          const isSelected = priority !== null;
          const isDisabled = !isSelected && selectedSkills.length >= maxSkills;
          
          return (
            <button
              key={skill.id}
              onClick={() => !isDisabled && handleSkillClick(skill)}
              disabled={isDisabled}
              className={cn(
                "p-3 rounded-xl border-2 text-left text-sm transition-all duration-200",
                priority === 'must-have' && "bg-accent/10 text-accent border-accent",
                priority === 'nice-to-have' && "bg-primary/10 text-primary border-primary/50",
                !isSelected && !isDisabled && "bg-card hover:bg-secondary border-border hover:border-accent/50",
                isDisabled && "opacity-40 cursor-not-allowed bg-muted border-muted"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "font-medium",
                  !isSelected && "text-foreground"
                )}>{skill.name}</span>
                {priority === 'must-have' && <Zap className="w-4 h-4" />}
                {priority === 'nice-to-have' && <Sparkles className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Helper text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">
          {selectedSkills.length}/{maxSkills} compétences sélectionnées
        </p>
        <p className="text-xs text-muted-foreground">
          💡 Priorisez les compétences vraiment essentielles pour votre projet.
        </p>
      </div>
    </div>
  );
}
