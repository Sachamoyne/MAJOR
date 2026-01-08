import { Skill, SkillCategory } from '@/types';

export const skillCategories: { id: SkillCategory; label: string; icon: string }[] = [
  { id: 'tech', label: 'Tech & Dev', icon: '💻' },
  { id: 'product', label: 'Produit', icon: '📱' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'operations', label: 'Opérations', icon: '⚙️' },
];

export const skills: Skill[] = [
  // Tech
  { id: 'frontend', name: 'Frontend (React, Vue...)', category: 'tech' },
  { id: 'backend', name: 'Backend (Node, Python...)', category: 'tech' },
  { id: 'mobile', name: 'Mobile (iOS, Android)', category: 'tech' },
  { id: 'devops', name: 'DevOps & Cloud', category: 'tech' },
  { id: 'data', name: 'Data Science / ML', category: 'tech' },
  { id: 'blockchain', name: 'Blockchain / Web3', category: 'tech' },
  
  // Product
  { id: 'pm', name: 'Product Management', category: 'product' },
  { id: 'ux-research', name: 'UX Research', category: 'product' },
  { id: 'agile', name: 'Méthodologies Agile', category: 'product' },
  { id: 'analytics', name: 'Product Analytics', category: 'product' },
  
  // Business
  { id: 'strategy', name: 'Stratégie Business', category: 'business' },
  { id: 'sales', name: 'Vente & Négociation', category: 'business' },
  { id: 'fundraising', name: 'Levée de fonds', category: 'business' },
  { id: 'finance', name: 'Finance & Comptabilité', category: 'business' },
  { id: 'legal', name: 'Juridique', category: 'business' },
  
  // Marketing
  { id: 'growth', name: 'Growth Hacking', category: 'marketing' },
  { id: 'content', name: 'Content Marketing', category: 'marketing' },
  { id: 'seo', name: 'SEO / SEA', category: 'marketing' },
  { id: 'social', name: 'Social Media', category: 'marketing' },
  { id: 'branding', name: 'Branding', category: 'marketing' },
  
  // Design
  { id: 'ui', name: 'UI Design', category: 'design' },
  { id: 'ux', name: 'UX Design', category: 'design' },
  { id: 'graphic', name: 'Design Graphique', category: 'design' },
  { id: 'motion', name: 'Motion Design', category: 'design' },
  
  // Operations
  { id: 'ops', name: 'Operations', category: 'operations' },
  { id: 'hr', name: 'RH & Recrutement', category: 'operations' },
  { id: 'customer-success', name: 'Customer Success', category: 'operations' },
  { id: 'project-management', name: 'Gestion de projet', category: 'operations' },
];

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skills.filter(skill => skill.category === category);
};

export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(skill => skill.id === id);
};
