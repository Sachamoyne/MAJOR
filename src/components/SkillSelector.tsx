import { useState } from 'react';
import { Skill, SkillCategory, SkillLevel, Priority, UserSkill, WantedSkill } from '@/types';
import { skills, skillCategories, getSkillsByCategory } from '@/data/skills';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface SkillSelectorProps {
  mode: 'offer' | 'want';
  selectedSkills: UserSkill[] | WantedSkill[];
  onSkillsChange: (skills: UserSkill[] | WantedSkill[]) => void;
  maxSkills?: number;
}

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  expert: 'Expert',
};

const priorityLabels: Record<Priority, string> = {
  'must-have': 'Indispensable',
  'nice-to-have': 'Bonus',
};

export function SkillSelector({ mode, selectedSkills, onSkillsChange, maxSkills = 6 }: SkillSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('tech');
  const [pendingSkill, setPendingSkill] = useState<Skill | null>(null);
  
  const categorySkills = getSkillsByCategory(activeCategory);
  
  const isSkillSelected = (skillId: string) => {
    return selectedSkills.some(s => s.skill.id === skillId);
  };
  
  const handleSkillClick = (skill: Skill) => {
    if (isSkillSelected(skill.id)) {
      // Remove skill
      const newSkills = selectedSkills.filter(s => s.skill.id !== skill.id);
      onSkillsChange(newSkills as any);
    } else if (selectedSkills.length < maxSkills) {
      // Show level/priority selector
      setPendingSkill(skill);
    }
  };
  
  const handleLevelSelect = (level: SkillLevel) => {
    if (!pendingSkill) return;
    
    const newSkill: UserSkill = {
      skill: pendingSkill,
      level,
    };
    
    onSkillsChange([...selectedSkills, newSkill] as UserSkill[]);
    setPendingSkill(null);
  };
  
  const handlePrioritySelect = (priority: Priority) => {
    if (!pendingSkill) return;
    
    const newSkill: WantedSkill = {
      skill: pendingSkill,
      priority,
    };
    
    onSkillsChange([...selectedSkills, newSkill] as WantedSkill[]);
    setPendingSkill(null);
  };
  
  return (
    <div className="space-y-6">
      {/* Selected skills */}
      {selectedSkills.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Sélectionnées ({selectedSkills.length}/{maxSkills})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((item) => (
              <Badge 
                key={item.skill.id}
                variant={mode === 'offer' ? 'skill' : 'skill-wanted'}
                className="py-1.5 px-3 text-sm cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSkillClick(item.skill)}
              >
                {item.skill.name}
                {mode === 'offer' && (item as UserSkill).level === 'expert' && ' ⭐'}
                {mode === 'want' && (item as WantedSkill).priority === 'must-have' && ' ⚡'}
                <X className="w-3 h-3 ml-1.5" />
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Pending skill selector */}
      {pendingSkill && (
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 animate-scale-in">
          <p className="text-sm font-medium text-foreground mb-3">
            {mode === 'offer' 
              ? `Quel est votre niveau en "${pendingSkill.name}" ?`
              : `Quelle importance pour "${pendingSkill.name}" ?`
            }
          </p>
          <div className="flex flex-wrap gap-2">
            {mode === 'offer' ? (
              <>
                {(['beginner', 'intermediate', 'expert'] as SkillLevel[]).map((level) => (
                  <Button
                    key={level}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLevelSelect(level)}
                  >
                    {levelLabels[level]}
                    {level === 'expert' && ' ⭐'}
                  </Button>
                ))}
              </>
            ) : (
              <>
                {(['must-have', 'nice-to-have'] as Priority[]).map((priority) => (
                  <Button
                    key={priority}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrioritySelect(priority)}
                  >
                    {priorityLabels[priority]}
                    {priority === 'must-have' && ' ⚡'}
                  </Button>
                ))}
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPendingSkill(null)}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {skillCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </Button>
        ))}
      </div>
      
      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-2">
        {categorySkills.map((skill) => {
          const isSelected = isSkillSelected(skill.id);
          const isDisabled = !isSelected && selectedSkills.length >= maxSkills;
          
          return (
            <button
              key={skill.id}
              onClick={() => !isDisabled && handleSkillClick(skill)}
              disabled={isDisabled}
              className={cn(
                "p-3 rounded-lg border text-left text-sm transition-all duration-200",
                isSelected && "bg-primary text-primary-foreground border-primary",
                !isSelected && !isDisabled && "bg-card hover:bg-secondary border-border hover:border-primary/50",
                isDisabled && "opacity-50 cursor-not-allowed bg-muted"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{skill.name}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
