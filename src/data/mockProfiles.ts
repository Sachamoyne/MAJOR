import { UserProfile, Match, MatchScore, MatchLevel } from '@/types';
import { getSkillById } from './skills';

const createSkill = (id: string, level: 'beginner' | 'intermediate' | 'expert') => ({
  skill: getSkillById(id)!,
  level,
});

const createWantedSkill = (id: string, priority: 'must-have' | 'nice-to-have') => ({
  skill: getSkillById(id)!,
  priority,
});

export const mockProfiles: UserProfile[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    bio: 'Ex-Google, 8 ans d\'expérience en product management. Passionnée par les produits qui ont un impact positif sur la société.',
    skills: [
      createSkill('product-management', 'expert'),
      createSkill('ux-ui', 'expert'),
      createSkill('no-code', 'intermediate'),
    ],
    wantedSkills: [
      createWantedSkill('backend', 'must-have'),
      createWantedSkill('frontend', 'must-have'),
      createWantedSkill('growth-hacking', 'nice-to-have'),
    ],
    role: 'product',
    availability: 'full-time',
    ambition: 'unicorn',
    location: 'Paris',
    linkedIn: 'https://linkedin.com/in/mariedupont',
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Bernard',
    bio: 'CTO sortant d\'une startup SaaS B2B (exit 15M€). Je cherche à repartir sur un nouveau projet ambitieux dans la tech.',
    skills: [
      createSkill('backend', 'expert'),
      createSkill('devops', 'expert'),
      createSkill('frontend', 'intermediate'),
      createSkill('data-ml', 'intermediate'),
    ],
    wantedSkills: [
      createWantedSkill('sales', 'must-have'),
      createWantedSkill('business-strategy', 'must-have'),
      createWantedSkill('fundraising', 'nice-to-have'),
    ],
    role: 'technical',
    availability: 'full-time',
    ambition: 'unicorn',
    location: 'Lyon',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Martin',
    bio: 'Directrice Marketing chez une scale-up. Expertise en growth et acquisition. Prête pour l\'aventure entrepreneuriale.',
    skills: [
      createSkill('growth-hacking', 'expert'),
      createSkill('seo-seo', 'expert'),
      createSkill('content-marketing', 'intermediate'),
      createSkill('social-media', 'intermediate'),
    ],
    wantedSkills: [
      createWantedSkill('frontend', 'must-have'),
      createWantedSkill('backend', 'must-have'),
      createWantedSkill('product-management', 'nice-to-have'),
    ],
    role: 'marketing',
    availability: 'part-time',
    ambition: 'growth',
    location: 'Bordeaux',
  },
  {
    id: '4',
    firstName: 'Alexandre',
    lastName: 'Petit',
    bio: 'Serial entrepreneur, 2 startups créées. Expert en levée de fonds et développement commercial B2B.',
    skills: [
      createSkill('sales', 'expert'),
      createSkill('fundraising', 'expert'),
      createSkill('business-strategy', 'expert'),
      createSkill('finance', 'intermediate'),
    ],
    wantedSkills: [
      createWantedSkill('backend', 'must-have'),
      createWantedSkill('frontend', 'must-have'),
      createWantedSkill('product-management', 'must-have'),
    ],
    role: 'business',
    availability: 'full-time',
    ambition: 'unicorn',
    location: 'Paris',
  },
  {
    id: '5',
    firstName: 'Julie',
    lastName: 'Leroy',
    bio: 'Lead Designer chez Figma. Passionnée par la création de produits beaux et fonctionnels.',
    skills: [
      createSkill('ux-ui', 'expert'),
      createSkill('product-management', 'intermediate'),
      createSkill('no-code', 'intermediate'),
    ],
    wantedSkills: [
      createWantedSkill('frontend', 'must-have'),
      createWantedSkill('backend', 'must-have'),
      createWantedSkill('business-strategy', 'nice-to-have'),
    ],
    role: 'product',
    availability: 'evenings-weekends',
    ambition: 'growth',
    location: 'Nantes',
  },
];

const calculateMatchScore = (profile: UserProfile): MatchScore => {
  // Simulated scoring algorithm
  const skillComplementarity = Math.floor(Math.random() * 30) + 70;
  const availability = Math.floor(Math.random() * 30) + 70;
  const ambition = Math.floor(Math.random() * 30) + 70;
  const overall = Math.round((skillComplementarity * 0.5 + availability * 0.25 + ambition * 0.25));
  
  return {
    overall,
    skillComplementarity,
    availability,
    ambition,
  };
};

const getMatchLevel = (score: number): MatchLevel => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  return 'explore';
};

const getMatchReasons = (profile: UserProfile, score: MatchScore): string[] => {
  const reasons: string[] = [];
  
  if (score.skillComplementarity >= 80) {
    reasons.push('Excellente complémentarité de compétences');
  }
  if (score.availability >= 80) {
    reasons.push('Disponibilité compatible');
  }
  if (score.ambition >= 80) {
    reasons.push('Vision alignée sur l\'ambition');
  }
  if (profile.skills.some(s => s.level === 'expert')) {
    reasons.push(`Expert en ${profile.skills.find(s => s.level === 'expert')?.skill.name}`);
  }
  
  return reasons.slice(0, 3);
};

export const getMockMatches = (): Match[] => {
  return mockProfiles
    .map(profile => {
      const score = calculateMatchScore(profile);
      return {
        profile,
        score,
        level: getMatchLevel(score.overall),
        reasons: getMatchReasons(profile, score),
      };
    })
    .sort((a, b) => b.score.overall - a.score.overall);
};
