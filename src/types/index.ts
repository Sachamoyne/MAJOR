export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export type SkillCategory = 
  | 'tech'
  | 'product'
  | 'business'
  | 'marketing'
  | 'design'
  | 'operations';

export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type Priority = 'must-have' | 'nice-to-have';

export interface UserSkill {
  skill: Skill;
  level: SkillLevel;
}

export interface WantedSkill {
  skill: Skill;
  priority: Priority;
}

export type Role = 
  | 'technical'
  | 'product'
  | 'business'
  | 'marketing'
  | 'generalist';

export type Availability = 
  | 'full-time'
  | 'part-time'
  | 'evenings-weekends';

export type Ambition = 
  | 'lifestyle'
  | 'growth'
  | 'unicorn';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio: string;
  skills: UserSkill[];
  wantedSkills: WantedSkill[];
  role: Role;
  availability: Availability;
  ambition: Ambition;
  location?: string;
  linkedIn?: string;
}

export interface MatchScore {
  overall: number;
  skillComplementarity: number;
  availability: number;
  ambition: number;
}

export type MatchLevel = 'excellent' | 'good' | 'explore';

export interface Match {
  profile: UserProfile;
  score: MatchScore;
  level: MatchLevel;
  reasons: string[];
}

export interface OnboardingData {
  firstName: string;
  lastName: string;
  bio: string;
  skills: UserSkill[];
  wantedSkills: WantedSkill[];
  role: Role;
  availability: Availability;
  ambition: Ambition;
}
