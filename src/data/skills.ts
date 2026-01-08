import { Skill, SkillCategory } from '@/types';

export const skillCategories: { id: SkillCategory; label: string; icon: string }[] = [
  { id: 'tech-product', label: 'Tech / Produit', icon: '💻' },
  { id: 'business-strategy', label: 'Business / Stratégie', icon: '💼' },
  { id: 'marketing-growth', label: 'Marketing / Growth', icon: '📣' },
  { id: 'finance-legal', label: 'Finance / Légal', icon: '📊' },
  { id: 'ops-organization', label: 'Ops / Organisation', icon: '⚙️' },
  { id: 'sector-expertise', label: 'Expertise sectorielle', icon: '🎯' },
];

export const skills: Skill[] = [
  // Tech / Produit
  { id: 'frontend', name: 'Développement Frontend', category: 'tech-product' },
  { id: 'backend', name: 'Développement Backend', category: 'tech-product' },
  { id: 'mobile', name: 'Développement Mobile', category: 'tech-product' },
  { id: 'fullstack', name: 'Développement Fullstack', category: 'tech-product' },
  { id: 'devops', name: 'DevOps / Cloud', category: 'tech-product' },
  { id: 'data-ml', name: 'Data / Machine Learning', category: 'tech-product' },
  { id: 'product-management', name: 'Product Management', category: 'tech-product' },
  { id: 'ux-ui', name: 'UX / UI Design', category: 'tech-product' },
  { id: 'no-code', name: 'No-code / Low-code', category: 'tech-product' },

  // Business / Stratégie
  { id: 'business-strategy', name: 'Stratégie d\'entreprise', category: 'business-strategy' },
  { id: 'sales', name: 'Vente B2B / B2C', category: 'business-strategy' },
  { id: 'bizdev', name: 'Business Development', category: 'business-strategy' },
  { id: 'partnerships', name: 'Partenariats', category: 'business-strategy' },
  { id: 'fundraising', name: 'Levée de fonds', category: 'business-strategy' },
  { id: 'market-analysis', name: 'Analyse de marché', category: 'business-strategy' },

  // Marketing / Growth
  { id: 'growth-hacking', name: 'Growth Hacking', category: 'marketing-growth' },
  { id: 'acquisition', name: 'Acquisition payante', category: 'marketing-growth' },
  { id: 'seo-seo', name: 'SEO / SEA', category: 'marketing-growth' },
  { id: 'content-marketing', name: 'Content Marketing', category: 'marketing-growth' },
  { id: 'social-media', name: 'Social Media', category: 'marketing-growth' },
  { id: 'branding', name: 'Branding / Identité', category: 'marketing-growth' },
  { id: 'community', name: 'Community Management', category: 'marketing-growth' },

  // Finance / Légal
  { id: 'finance', name: 'Gestion financière', category: 'finance-legal' },
  { id: 'accounting', name: 'Comptabilité', category: 'finance-legal' },
  { id: 'legal', name: 'Juridique startup', category: 'finance-legal' },
  { id: 'fundraising-ops', name: 'Opérations de levée', category: 'finance-legal' },
  { id: 'kpis-reporting', name: 'KPIs / Reporting', category: 'finance-legal' },

  // Ops / Organisation
  { id: 'operations', name: 'Opérations', category: 'ops-organization' },
  { id: 'project-management', name: 'Gestion de projet', category: 'ops-organization' },
  { id: 'hr-recruitment', name: 'RH / Recrutement', category: 'ops-organization' },
  { id: 'customer-success', name: 'Customer Success', category: 'ops-organization' },
  { id: 'supply-chain', name: 'Supply Chain', category: 'ops-organization' },

  // Expertise sectorielle
  { id: 'saas', name: 'SaaS / Logiciel', category: 'sector-expertise' },
  { id: 'ecommerce', name: 'E-commerce / Retail', category: 'sector-expertise' },
  { id: 'fintech', name: 'Fintech', category: 'sector-expertise' },
  { id: 'healthtech', name: 'Healthtech / Medtech', category: 'sector-expertise' },
  { id: 'edtech', name: 'Edtech', category: 'sector-expertise' },
  { id: 'proptech', name: 'Proptech / Immobilier', category: 'sector-expertise' },
  { id: 'foodtech', name: 'Foodtech', category: 'sector-expertise' },
  { id: 'greentech', name: 'Greentech / Climate', category: 'sector-expertise' },
  { id: 'b2b', name: 'B2B Enterprise', category: 'sector-expertise' },
  { id: 'marketplace', name: 'Marketplace', category: 'sector-expertise' },
];

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skills.filter(skill => skill.category === category);
};

export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(skill => skill.id === id);
};
